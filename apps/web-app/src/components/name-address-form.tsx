"use client";

import * as React from "react";
import { type Resolver, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { RhfInput } from "./rhf-input";
import FormSubmitButton from "./ui/form-submit-button";
import { nameofFactory, type ShapeOf } from "./utils/type-helpers";
import { FormContainer } from "./ui/molecules/forms/form-container";

interface FormValues {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const nameof = nameofFactory<FormValues>();

const nameAddressFormSchema = Yup.object().shape({
  firstName: Yup.string().required().label("First Name"),
  lastName: Yup.string().required().label("Last Name"),
  street: Yup.string().required().label("Street Address"),
  city: Yup.string().required().label("City"),
  state: Yup.string().required().label("State"),
  zipCode: Yup.string()
    .required()
    .matches(/^\d{5}(-\d{4})?$/, "Invalid ZIP code")
    .label("ZIP Code"),
} as ShapeOf<FormValues>);

export const NameAddressForm: React.FC = () => {
  const defaultValues: FormValues = {
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  };

  const formContext = useForm({
    defaultValues,
    resolver: yupResolver(nameAddressFormSchema) as Resolver<FormValues>,
    mode: "onChange",
    shouldUnregister: false,
  });

  const onSubmit = React.useCallback(async (values: FormValues) => {
    console.log("submit", values);
    // Handle form submission here
  }, []);

  return (
    <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <RhfInput
            name={nameof("firstName")}
            label="First Name"
            placeholder="First Name"
          />
          <RhfInput
            name={nameof("lastName")}
            label="Last Name"
            placeholder="Last Name"
          />
        </div>
        <RhfInput
          name={nameof("street")}
          label="Street Address"
          placeholder="Street Address"
          fullWidth
        />
        <div className="grid grid-cols-3 gap-4">
          <RhfInput name={nameof("city")} label="City" placeholder="City" />
          <RhfInput name={nameof("state")} label="State" placeholder="State" />
          <RhfInput
            name={nameof("zipCode")}
            label="ZIP Code"
            placeholder="ZIP Code"
          />
        </div>
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </FormContainer>
  );
};

export default NameAddressForm;
