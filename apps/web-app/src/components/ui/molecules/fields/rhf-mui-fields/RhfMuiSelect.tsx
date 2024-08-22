/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { type FC } from 'react';
import { Controller, type FieldValues, useFormContext } from 'react-hook-form';
import { Select, MenuItem, FormControl, InputLabel, type SelectChangeEvent, type SelectProps, FormHelperText } from '@mui/material';
import { useDefaultProps } from '../useDefaultProps';
import { useFieldMaterialUIStyles } from '../useFieldMaterialUIStyles';

interface Option {
  id: string | number;
  label: string;
}

interface IRhfMuiSelectProps<T extends FieldValues> extends Omit<SelectProps, 'name' | 'control' | 'options'> {
  name: string;
  options: Option[];
  label?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  placeholder?: string;
  multiple?: boolean;
  hideFieldLabel?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RhfMuiSelect: FC<IRhfMuiSelectProps<any>> = (props) => {
  props = { ...props, ...useDefaultProps(props) };

  const { control } = useFormContext();

  const { name, options, label, fullWidth = true, size = 'small', placeholder, multiple = false, hideFieldLabel = false, ...rest } = props;

  const { classes, cx } = useFieldMaterialUIStyles();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;

        return (
          <FormControl fullWidth={fullWidth} size={size} error={!!error} className={cx({ [classes.shortWidth]: !fullWidth })}>
            {!hideFieldLabel && <InputLabel error={!!error}>{label}</InputLabel>}
            <Select
              {...field}
              multiple={multiple}
              displayEmpty={!!placeholder}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>{placeholder}</em>;
                }
                if (multiple) {
                  return (selected as (string | number)[]).map((id) => options.find((option) => option.id === id)?.label).join(', ');
                }
                return options.find((option) => option.id === selected)?.label;
              }}
              onChange={(event: SelectChangeEvent<unknown>) => {
                field.onChange(event.target.value);
              }}
              error={!!error}
              {...rest}
            >
              {placeholder && (
                <MenuItem value='' disabled>
                  <em>{placeholder}</em>
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
};
