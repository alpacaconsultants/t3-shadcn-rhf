import { type ButtonProps, CircularProgress } from '@mui/material';
import { type FC, type PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { ProgressButton } from './BaseButtons';

export type SubmitButtonProps = Omit<ButtonProps, 'type' | 'onClick'> & {
  color?: ButtonProps['color'];
  isSubmitting?: boolean;
  allowSubmitPristine?: boolean;
};

const FormSubmitButton: FC<PropsWithChildren<SubmitButtonProps>> = ({ allowSubmitPristine, children, disabled, ...rest }) => {
  const { isSubmitting, isDirty } = useFormState();

  return (
    <ProgressButton disabled={(!isDirty && !allowSubmitPristine) || isSubmitting || disabled} {...rest}>
      {children}
      {isSubmitting && <CircularProgress size={20} sx={{ marginLeft: '1em' }} />}
    </ProgressButton>
  );
};

export default FormSubmitButton;
