/* eslint-disable react/jsx-key */
import { Button, type ButtonProps, CircularProgress } from '@mui/material';
import { type FC, useState } from 'react';

export type SubmitButtonProps = Omit<ButtonProps, 'type'> & {
  isSubmitting?: boolean;
  onClick?: ButtonProps['onClick'];
  testId?: string;
};

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const { children, color, disabled, isSubmitting, onClick, testId = 'submit-button', variant = 'contained', ...rest } = props;

  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);

  return (
    <Button
      color={color ?? 'primary'}
      data-testid={testId}
      disabled={disabled ?? isSubmitting ?? internalIsSubmitting}
      onClick={
        onClick
          ? async (event) => {
              setInternalIsSubmitting(true);
              // eslint-disable-next-line @typescript-eslint/await-thenable
              await onClick(event);
              setInternalIsSubmitting(false);
            }
          : undefined
      }
      type='submit'
      variant={variant}
      {...rest}
    >
      {children}
      {(isSubmitting ?? internalIsSubmitting) && <CircularProgress size={20} sx={{ marginLeft: '1em' }} />}
    </Button>
  );
};
