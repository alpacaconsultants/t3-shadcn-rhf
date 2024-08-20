import type * as Yup from 'yup';

export const nameofFactory =
  <T>() =>
  (name: keyof T) =>
    name;

// From https://dev.to/jpoehnelt/strongly-typed-yup-schema-in-typescript-15bc
export type ConditionalSchema<T> = T extends string
  ? Yup.StringSchema
  : T extends number
    ? Yup.NumberSchema
    : T extends boolean
      ? Yup.BooleanSchema
      : // Relaxed type to allow more complex shapes
        any;

export type ShapeOf<Fields> = {
  [Key in keyof Fields]: ConditionalSchema<Fields[Key]>;
};
