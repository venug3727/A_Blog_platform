"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useErrorHandler, extractFieldErrors } from "@/lib/error-utils";
import { useAppStore } from "@/stores/useAppStore";

export function useFormWithError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<any>,
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (data: any) => void;
    onError?: (error: unknown) => void;
    successMessage?: string;
  }
) {
  const form = useForm({
    defaultValues: options?.defaultValues,
    mode: "onChange",
  });

  const { handleError } = useErrorHandler();
  const { showSuccess, setLoading, isLoading } = useAppStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitWithError = (submitFn: (data: any) => Promise<void>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (data: any) => {
      try {
        setLoading("form-submit", true);

        // Validate with Zod
        const validatedData = await schema.parseAsync(data);
        await submitFn(validatedData);

        if (options?.successMessage) {
          showSuccess("Success", options.successMessage);
        }

        options?.onSuccess?.(validatedData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Handle Zod validation errors
          error.issues.forEach((issue) => {
            const path = issue.path.join(".");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form.setError(path as any, {
              type: "validation",
              message: issue.message,
            });
          });
        } else {
          // Extract field-specific errors from other sources
          const fieldErrors = extractFieldErrors(error);
          Object.entries(fieldErrors).forEach(([field, message]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form.setError(field as any, {
              type: "server",
              message,
            });
          });

          // If no field-specific errors, show general error
          if (Object.keys(fieldErrors).length === 0) {
            handleError(error);
          }
        }

        options?.onError?.(error);
      } finally {
        setLoading("form-submit", false);
      }
    };
  };

  const isSubmitting = isLoading("form-submit");

  return {
    ...form,
    handleSubmitWithError,
    isSubmitting,
  };
}
