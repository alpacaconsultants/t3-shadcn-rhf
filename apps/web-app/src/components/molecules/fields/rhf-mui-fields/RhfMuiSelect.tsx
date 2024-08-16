import { type FC } from 'react';

import { type FieldValues } from 'react-hook-form';
import { SelectElement, type SelectElementProps } from 'react-hook-form-mui';
import { useDefaultProps } from '../useDefaultProps';
import { useFieldMaterialUIStyles } from '../useFieldMaterialUIStyles';

interface IRhfMuiSelectProps extends SelectElementProps<FieldValues> {
  hideFieldLabel?: boolean;
  multiple?: boolean;
}

export const RhfMuiSelect: FC<IRhfMuiSelectProps> = (props) => {
  const {
    fullWidth = true,
    size = 'small',
    options,
    placeholder,
    children,
    SelectProps,
    ...rest
  } = { ...props, ...useDefaultProps(props) };
  const { classes, cx } = useFieldMaterialUIStyles();

  return (
    <>
      <SelectElement
        className={cx({ [classes.shortWidth]: !fullWidth })}
        fullWidth
        size={size}
        options={options}
        SelectProps={{
          displayEmpty: !!placeholder,
          ...SelectProps,
        }}
        {...rest}
      />
      {children}
    </>
  );
};
