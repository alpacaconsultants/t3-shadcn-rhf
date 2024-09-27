"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useCustomFormContainerContext } from "./form/form-container";
import { useDefaultProps } from "./form/useDefaultProps";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface RhfInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  fullWidth?: boolean;
}

export const RhfInput: React.FC<RhfInputProps> = (props) => {
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
            "grid items-center gap-1.5",
            fullWidth ? "w-full" : "w-auto",
          )}
        >
          {label && <Label htmlFor={name}>{label}</Label>}
          {!isReadOnly ? (
            <Input
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
            <div className="rounded bg-gray-100 p-2">{field.value}</div>
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
