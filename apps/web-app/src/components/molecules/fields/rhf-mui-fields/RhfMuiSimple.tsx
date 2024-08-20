import { type FC } from 'react';

import {
  TextFieldElement,
  type TextFieldElementProps,
  useWatch,
  CheckboxButtonGroup,
  type CheckboxButtonGroupProps,
} from 'react-hook-form-mui';
import { type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useDefaultProps } from '../useDefaultProps';
import { useFieldMaterialUIStyles } from '../useFieldMaterialUIStyles';

export const RhfMuiTextArea: FC<TextFieldElementProps> = (props) => {
  const { fullWidth = true, size = 'small', children, isReadOnly, name, ...rest } = { ...props, ...useDefaultProps(props) };
  const { classes, cx } = useFieldMaterialUIStyles();

  const value = useWatch({ name });
  const formContext = useFormContext();

  const handleTrimOnBlur = (event: any) => {
    formContext.setValue(name, event.target.textContent.trim());
  };

  return (
    <>
      {!isReadOnly && (
        <TextFieldElement
          onBlurCapture={handleTrimOnBlur}
          name={name}
          className={cx({ [classes.shortWidth]: !fullWidth })}
          multiline
          rows={6}
          fullWidth
          size={size}
          label='Input Description'
          {...rest}
        />
      )}
      {isReadOnly && value}
      {children}
    </>
  );
};

export interface RhfMuiTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  isReadOnly?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  // Add any other custom props you need for your component
}

export const RhfMuiTextField: React.FC<RhfMuiTextFieldProps> = (props) => {
  const { fullWidth = true, size = 'small', isReadOnly, name, children, ...rest } = props;
  const { classes, cx } = useFieldMaterialUIStyles();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          {!isReadOnly ? (
            <TextField
              {...field}
              {...rest}
              className={cx({ [classes.shortWidth]: !fullWidth })}
              fullWidth={fullWidth}
              size={size}
              error={!!errors[name]}
              helperText={errors[name]?.message as string}
            />
          ) : (
            <div>{field.value}</div>
          )}
          {children}
        </>
      )}
    />
  );
};

export const RhfMuiNumericField: FC<TextFieldElementProps> = (props) => {
  props = { ...props, ...useDefaultProps(props) };
  const { fullWidth = true, size = 'small', children, isReadOnly, name, ...rest } = { ...props, ...useDefaultProps(props) };
  const { classes, cx } = useFieldMaterialUIStyles();

  const value = useWatch({ name });

  return (
    <>
      {!isReadOnly && (
        <TextFieldElement
          className={cx({ [classes.shortWidth]: !fullWidth })}
          fullWidth
          size={size}
          name={name}
          inputProps={{ inputMode: 'decimal', min: '0', step: 'any' }}
          type='number'
          {...rest}
        />
      )}
      {isReadOnly && value}
      {children}
    </>
  );
};

export const RhfMuiCheckboxButtonGroup: FC<CheckboxButtonGroupProps<any>> = (props) => {
  props = { ...props, ...useDefaultProps(props) };
  const { ...rest } = props;

  return <CheckboxButtonGroup {...rest} />;
};
