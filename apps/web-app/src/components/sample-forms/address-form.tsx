"use client";

import * as React from "react";
import { useCallback } from "react";
import { type Resolver, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { nameofFactory, type ShapeOf } from "~/components/utils/type-helpers";
import { FormContainer } from "~/components/forms/form-container";
import { RhfInput } from "~/components/rhf-input";
import { RhfSelect } from "~/components/rhf-select";
import FormSubmitButton from "~/components/ui/form-submit-button";

interface AddressFormValues {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const nameof = nameofFactory<AddressFormValues>();

const addressFormSchema = Yup.object().shape({
  streetAddress: Yup.string().required().label("Street Address"),
  city: Yup.string().required().label("City"),
  state: Yup.string().required().label("State/Province"),
  postalCode: Yup.string().required().label("Postal Code"),
  country: Yup.string().required().label("Country"),
} as ShapeOf<AddressFormValues>);

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  // Add more countries as needed
];

export const AddressForm: React.FC = () => {
  const defaultValues: AddressFormValues = {
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };

  const formContext = useForm({
    defaultValues,
    resolver: yupResolver(addressFormSchema) as Resolver<AddressFormValues>,
    mode: "onChange",
    shouldUnregister: false,
  });

  const onSubmit = useCallback(async (values: AddressFormValues) => {
    console.log("submit", values);
    // Handle form submission here
  }, []);

  return (
    <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <div className="space-y-4">
        <RhfInput
          name={nameof("streetAddress")}
          label="Street Address"
          placeholder="Enter your street address"
        />
        <RhfInput
          name={nameof("city")}
          label="City"
          placeholder="Enter your city"
        />
        <RhfInput
          name={nameof("state")}
          label="State/Province"
          placeholder="Enter your state or province"
        />
        <RhfInput
          name={nameof("postalCode")}
          label="Postal Code"
          placeholder="Enter your postal code"
        />
        <RhfSelect
          name={nameof("country")}
          label="Country"
          placeholder="Select your country"
          options={countryOptions}
        />
        <FormSubmitButton>Submit Address</FormSubmitButton>
      </div>
    </FormContainer>
  );
};
