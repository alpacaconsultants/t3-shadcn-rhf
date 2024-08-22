import { type FC } from 'react';
import { type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useDefaultProps } from '../useDefaultProps';
import { useFieldMaterialUIStyles } from '../useFieldMaterialUIStyles';

export interface RhfMuiTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  isReadOnly?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  // Add any other custom props you need for your component
}

export const RhfMuiTextArea: FC<RhfMuiTextFieldProps> = (props) => <RhfMuiTextField {...props} rows={6} multiline />;

export const RhfMuiTextField: React.FC<RhfMuiTextFieldProps> = (props) => {
  props = { ...props, ...useDefaultProps(props) };
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

export const RhfMuiNumericField: FC<RhfMuiTextFieldProps> = (props) => (
  <RhfMuiTextField {...props} inputProps={{ inputMode: 'decimal', min: '0', step: 'any' }} type='number' />
);

// export const RhfMuiCheckboxButtonGroup: FC<CheckboxButtonGroupProps<any>> = (props) => {
//   props = { ...props, ...useDefaultProps(props) };
//   const { ...rest } = props;

//   return <CheckboxButtonGroup {...rest} />;
// };
