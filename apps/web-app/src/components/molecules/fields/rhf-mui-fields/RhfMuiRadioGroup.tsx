/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { type RadioButtonGroupProps, useFormContext, useWatch } from 'react-hook-form-mui';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { type ReactNode } from 'react';
import { useDefaultProps } from '../useDefaultProps';

export const RhfMuiRadioGroup: React.FC<
  RadioButtonGroupProps<any, any, any> & {
    children?: ReactNode;
  }
> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { isReadOnly, options, name, ...rest } = { ...props, ...useDefaultProps(props) };

  const value = useWatch({ name });
  const { setValue } = useFormContext();

  const handleChange = (e: any) => {
    setValue(name, e.target.value);
  };

  return (
    <>
      {!isReadOnly && (
        <RadioGroup value={value} name={name} row onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              disabled={option.disabled}
              control={<Radio {...rest} />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      )}
      {isReadOnly && options.find((o) => o.id === value)?.label}
      {rest?.children}
    </>
  );
};
