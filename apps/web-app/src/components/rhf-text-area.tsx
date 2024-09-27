"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useDefaultProps } from "./form/useDefaultProps";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface RhfTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  fullWidth?: boolean;
}

export const RhfTextarea: React.FC<RhfTextareaProps> = (props) => {
  const {
    name,
    label,
    fullWidth = true,
    className,
    isReadOnly,
    ...rest
  } = { ...props, ...useDefaultProps(props) };
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          className={cn(
            "grid max-w-sm items-center gap-1.5",
            fullWidth ? "w-full" : "w-auto",
          )}
        >
          {label && <Label htmlFor={name}>{label}</Label>}
          {!isReadOnly ? (
            <Textarea
              {...field}
              {...rest}
              id={name}
              className={cn(
                errors[name] && "border-red-500",
                fullWidth ? "w-full" : "w-auto",
                className,
              )}
            />
          ) : (
            <div className="whitespace-pre-wrap rounded bg-gray-100 p-2">
              {field.value}
            </div>
          )}
          {errors[name] && (
            <p className="text-sm text-red-500">
              {errors[name]?.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
};
