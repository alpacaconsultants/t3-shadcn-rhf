"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface RhfPhoneInputProps {
  name: string;
  label: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const RhfPhoneInput: React.FC<RhfPhoneInputProps> = ({
  name,
  label,
  placeholder,
  fullWidth = true,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div
      className={cn(
        "grid w-full items-center gap-1.5",
        !fullWidth ? "max-w-sm" : "",
      )}
    >
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        placeholder={placeholder}
        {...register(name)}
        type="tel"
      />
      {errors[name] && (
        <p className="text-sm text-red-500">
          {errors[name].message?.toString()}
        </p>
      )}
    </div>
  );
};
