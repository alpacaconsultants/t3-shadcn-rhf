"use client";

import * as React from "react";
import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { nameofFactory, type ShapeOf } from "~/components/utils/type-helpers";
import { FormContainer } from "~/components/form/form-container";
import { RhfInput } from "~/components/rhf-input";
import { RhfSelect } from "~/components/rhf-select";
import { RhfPhoneInput } from "~/components/rhf-phone-input";
import FormSubmitButton from "~/components/ui/form-submit-button";

interface AddressContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const nameof = nameofFactory<AddressContactFormValues>();

const addressContactFormSchema = Yup.object().shape({
  fullName: Yup.string().required().label("Full Name"),
  email: Yup.string().email().required().label("Email"),
  phone: Yup.string().required().label("Phone"),
  streetAddress: Yup.string().required().label("Street Address"),
  city: Yup.string().required().label("City"),
  state: Yup.string().required().label("State/Province"),
  postalCode: Yup.string().required().label("Postal Code"),
  country: Yup.string().required().label("Country"),
} as ShapeOf<AddressContactFormValues>);

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  // Add more countries as needed
];

export const AddressContactForm: React.FC = () => {
  const defaultValues: AddressContactFormValues = {
    fullName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };

  const formContext = useForm({
    defaultValues,
    resolver: yupResolver(
      addressContactFormSchema,
    ) as Resolver<AddressContactFormValues>,
    mode: "onChange",
    shouldUnregister: false,
  });

  const onSubmit = useCallback(async (values: AddressContactFormValues) => {
    console.log("submit", values);
    // Handle form submission here
  }, []);

  return (
    <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Address and Contact Information</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RhfInput
            name={nameof("fullName")}
            label="Full Name"
            placeholder="Enter your full name"
          />
          <RhfInput
            name={nameof("email")}
            label="Email"
            placeholder="Enter your email address"
          />
          <RhfPhoneInput
            name={nameof("phone")}
            label="Phone"
            placeholder="Enter your phone number"
          />
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
        </div>
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </FormContainer>
  );
};
