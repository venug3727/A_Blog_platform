"use client";

import { ReactNode } from "react";
import { z } from "zod";
import { useSimpleForm } from "@/hooks/useSimpleForm";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-overlay";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EnhancedFormProps<T = unknown> {
  schema: z.ZodType<T>;
  onSubmit: (data: T) => Promise<void>;
  defaultValues?: Partial<T>;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  successMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function EnhancedForm<T = unknown>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  successMessage,
  className,
  disabled = false,
}: EnhancedFormProps<T>) {
  const form = useSimpleForm(schema, {
    defaultValues,
    successMessage,
  });

  const { handleSubmitWithError, isSubmitting } = form;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitWithError(onSubmit))}
        className={cn("space-y-6", className)}
      >
        {children}

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || disabled}
            className="flex-1 sm:flex-none"
          >
            {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
            {submitLabel}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {cancelLabel}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

// Pre-built form field components with error handling
interface FormFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FormInput({
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormTextarea({
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  rows = 4,
  ...props
}: FormFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              {...field}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
