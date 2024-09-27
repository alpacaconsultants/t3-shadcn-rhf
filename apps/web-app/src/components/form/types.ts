/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOption {
  id: string;
}

export type IOptionOrString = IOption | string;

export interface IOptionsProps<T extends IOptionOrString = INamedOption> {
  getOptionLabel: (option: T) => string;
  options: T[];
  orderByOptionLabel?: boolean;
}

export interface INamedOption extends IOption {
  name: string;
}

export type FieldValues = Record<string, any>;
