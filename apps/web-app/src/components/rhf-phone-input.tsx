"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface RhfPhoneInputProps {
  name: string;
  label: string;
  placeholder?: string;
}

export const RhfPhoneInput: React.FC<RhfPhoneInputProps> = ({
  name,
  label,
  placeholder,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
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
