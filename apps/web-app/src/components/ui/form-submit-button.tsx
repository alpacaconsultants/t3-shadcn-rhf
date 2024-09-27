import { CircularProgress } from "@mui/material";
import { type FC, type PropsWithChildren } from "react";
import { useFormState } from "react-hook-form";
import { ProgressButton } from "./progress-button";
import { type ButtonProps } from "./button";

export type SubmitButtonProps = Omit<ButtonProps, "type" | "onClick"> & {
  color?: ButtonProps["color"];
  isSubmitting?: boolean;
  allowSubmitPristine?: boolean;
};

const FormSubmitButton: FC<PropsWithChildren<SubmitButtonProps>> = ({
  allowSubmitPristine,
  children,
  disabled,
  ...rest
}) => {
  const { isSubmitting, isDirty } = useFormState();

  return (
    <ProgressButton
      disabled={(!isDirty && !allowSubmitPristine) || isSubmitting || disabled}
      {...rest}
    >
      {children}
      {isSubmitting && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded-full bg-primary-foreground" />
        </div>
      )}
    </ProgressButton>
  );
};

export default FormSubmitButton;
