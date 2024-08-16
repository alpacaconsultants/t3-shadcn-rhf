import { type FC } from 'react';

import {
  TextFieldElement,
  type TextFieldElementProps,
  useWatch,
  useFormContext,
  CheckboxButtonGroup,
  type CheckboxButtonGroupProps,
} from 'react-hook-form-mui';
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

export const RhfMuiTextField: FC<TextFieldElementProps> = (props) => {
  props = { ...props, ...useDefaultProps(props) };
  const { fullWidth = true, size = 'small', isReadOnly, name, children, ...rest } = { ...props, ...useDefaultProps(props) };
  const { classes, cx } = useFieldMaterialUIStyles();
  const value = useWatch({ name });

  return (
    <>
      {!isReadOnly && <TextFieldElement name={name} className={cx({ [classes.shortWidth]: !fullWidth })} fullWidth size={size} {...rest} />}
      {isReadOnly && value}
      {children}
    </>
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
