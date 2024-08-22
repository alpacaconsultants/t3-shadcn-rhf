/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { type PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { FormContainer as RhfFormContainer, type FormContainerProps } from 'react-hook-form-mui';

interface IMyFormContainerContext {
  isReadOnly?: boolean;
}

const CustomFormContainerContext = createContext<IMyFormContainerContext | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldValues = Record<string, any>;
export const useCustomFormContainerContext = () => {
  const context = useContext(CustomFormContainerContext);
  if (!context) {
    throw new Error('No Context found. useCustomFormContainerContext must be used inside custom FormContainer.');
  }
  return context;
};

// Custom FormContainer to provide a custom context
export const FormContainer = <TFieldValues extends FieldValues = FieldValues>(
  props: PropsWithChildren<FormContainerProps<TFieldValues> & IMyFormContainerContext>
) => {
  const { isReadOnly, ...rest } = props;

  const contextValue = useMemo(() => ({ isReadOnly }), [isReadOnly]);

  return (
    <CustomFormContainerContext.Provider value={contextValue}>
      <RhfFormContainer {...rest} />
    </CustomFormContainerContext.Provider>
  );
};
