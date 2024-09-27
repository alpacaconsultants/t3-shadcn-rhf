/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { createContext, useContext, useMemo } from "react";
import {
  type FormEventHandler,
  type FormHTMLAttributes,
  type PropsWithChildren,
} from "react";
import {
  FormProvider,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { type FieldValues } from "./types";

interface IMyFormContainerContext {
  isReadOnly?: boolean;
}

const CustomFormContainerContext =
  createContext<IMyFormContainerContext | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const useCustomFormContainerContext = () => {
  const context = useContext(CustomFormContainerContext);
  if (!context) {
    throw new Error(
      "No Context found. useCustomFormContainerContext must be used inside custom FormContainer.",
    );
  }
  return context;
};

// Custom FormContainer to provide a custom context
export const FormContainer = <TFieldValues extends FieldValues = FieldValues>(
  props: PropsWithChildren<
    FormContainerProps<TFieldValues> & IMyFormContainerContext
  >,
) => {
  const { isReadOnly, ...rest } = props;

  const contextValue = useMemo(() => ({ isReadOnly }), [isReadOnly]);

  return (
    <CustomFormContainerContext.Provider value={contextValue}>
      <FormContainerInternal {...rest} />
    </CustomFormContainerContext.Provider>
  );
};

export type FormContainerProps<T extends FieldValues = FieldValues> =
  PropsWithChildren<
    UseFormProps<T> & {
      onSuccess?: SubmitHandler<T>;
      onError?: SubmitErrorHandler<T>;
      FormProps?: FormHTMLAttributes<HTMLFormElement>;
      handleSubmit?: FormEventHandler<HTMLFormElement>;
      formContext?: UseFormReturn<T>;
    }
  >;

function FormContainerInternal<TFieldValues extends FieldValues = FieldValues>({
  handleSubmit,
  children,
  FormProps,
  formContext,
  onSuccess,
  onError,
  ...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
  if (!formContext) {
    return (
      <FormProviderWithoutContext<TFieldValues>
        {...{ onSuccess, onError, FormProps, children, ...useFormProps }}
      />
    );
  }
  if (typeof onSuccess === "function" && typeof handleSubmit === "function") {
    console.warn(
      "Property `onSuccess` will be ignored because handleSubmit is provided",
    );
  }
  return (
    <FormProvider {...formContext}>
      <form
        noValidate
        {...FormProps}
        onSubmit={
          handleSubmit
            ? handleSubmit
            : onSuccess
              ? formContext.handleSubmit(onSuccess, onError)
              : () => console.log("submit handler `onSuccess` is missing")
        }
      >
        {children}
      </form>
    </FormProvider>
  );
}

function FormProviderWithoutContext<
  TFieldValues extends FieldValues = FieldValues,
>({
  onSuccess,
  onError,
  FormProps,
  children,
  ...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
  const methods = useForm<TFieldValues>({
    ...useFormProps,
  });
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          onSuccess
            ? onSuccess
            : () => console.log("submit handler `onSuccess` is missing"),
          onError,
        )}
        noValidate
        {...FormProps}
      >
        {children}
      </form>
    </FormProvider>
  );
}
