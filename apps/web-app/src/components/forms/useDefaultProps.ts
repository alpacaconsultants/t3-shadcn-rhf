import { useFormState } from "react-hook-form";
import { useCustomFormContainerContext } from "./form-container";

export const useDefaultProps = (
  props: { disabled?: boolean },
  disableWhileSubmit = true,
) => {
  const { isSubmitting } = useFormState();
  const { isReadOnly } = useCustomFormContainerContext();

  if (!disableWhileSubmit) {
    return {
      disabled: undefined,
      isReadOnly,
    };
  }
  return {
    disabled: isSubmitting || props.disabled,
    isReadOnly,
  };
};
