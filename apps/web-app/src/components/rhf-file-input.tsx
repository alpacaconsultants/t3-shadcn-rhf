'use client'

import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Label } from "~/components/ui/label"
import { cn } from "~/lib/utils"

export interface RhfFileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
}

export const RhfFileInput = React.forwardRef<HTMLInputElement, RhfFileInputProps>(
  ({ className, name, label, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext()

    const error = errors[name]

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <input
          type="file"
          id={name}
          {...register(name)}
          {...props}
          ref={ref}
          className={cn(
            "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100",
            error && "border-red-500",
            className
          )}
        />
        {error && (
          <p className="text-sm text-red-500">
            {error.message?.toString() || "This field is required"}
          </p>
        )}
      </div>
    )
  }
)

RhfFileInput.displayName = "RhfFileInput"