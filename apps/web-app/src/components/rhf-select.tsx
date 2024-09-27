"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useDefaultProps } from "./form/useDefaultProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

interface RhfSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export const RhfSelect: React.FC<RhfSelectProps> = (props) => {
  const { name, label, placeholder, options } = {
    ...props,
    ...useDefaultProps(props),
  };
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
