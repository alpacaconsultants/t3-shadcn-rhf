"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";

export interface RhfFileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export const RhfFileInput = React.forwardRef<
  HTMLInputElement,
  RhfFileInputProps
>(({ className, name, label, ...props }, ref) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  // Custom change handler to manually set file
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue(name, file, { shouldValidate: true, shouldDirty: true }); // Update form state with file object
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <input
        type="file"
        id={name}
        onChange={handleChange} // Use custom change handler
        {...props}
        ref={ref}
        className={cn(
          "block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100",
          error && "border-red-500",
          className,
        )}
      />
      {error && (
        <p className="text-sm text-red-500">
          {error.message?.toString() || "This field is required"}
        </p>
      )}
    </div>
  );
});

RhfFileInput.displayName = "RhfFileInput";
