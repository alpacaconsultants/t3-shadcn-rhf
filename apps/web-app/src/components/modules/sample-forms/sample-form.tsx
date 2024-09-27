"use client";

import * as React from "react";
import { type FC, useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { nameofFactory, type ShapeOf } from "~/components/utils/type-helpers";
import { FormContainer } from "~/components/form/form-container";
import { RhfTextarea } from "~/components/rhf-text-area";
import { RhfInput } from "~/components/rhf-input";
import FormSubmitButton from "~/components/ui/form-submit-button";

interface FormValues {
  email: string;
  name: string;
  context: string;
}

const nameof = nameofFactory<FormValues>();

const surveyFormSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  name: Yup.string().required().label("Name"),
  context: Yup.string().required().label("Context"),
} as ShapeOf<FormValues>);

export const SampleForm: FC = ({}) => {
  const defaultValues: FormValues = {
    name: "",
    context: "",
    email: "",
  };

  const formContext = useForm({
    defaultValues,
    resolver: yupResolver(surveyFormSchema) as Resolver<FormValues>,
    mode: "onChange",
    shouldUnregister: false,
  });

  const onSubmit = useCallback(async (values: FormValues) => {
    // eslint-disable-next-line no-console
    console.log("submit", values);
  }, []);

  return (
    <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <div>
        <RhfInput name={nameof("email")} label="Email" placeholder="Email" />
        <RhfTextarea
          name={nameof("context")}
          label="Context"
          placeholder="Context"
          rows={6}
        />
        <RhfInput name={nameof("name")} label="Name" placeholder="Name" />
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </FormContainer>
  );
};
