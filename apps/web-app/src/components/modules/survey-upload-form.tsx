"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { nameofFactory, type ShapeOf } from "~/components/utils/type-helpers";
import { FormContainer } from "~/components/ui/molecules/forms/form-container";
import { RhfInput } from "~/components/rhf-input";
import { RhfTextarea } from "~/components/rhf-text-area";
import { RhfFileInput } from "~/components/rhf-file-input";
import FormSubmitButton from "~/components/ui/form-submit-button";
import { Progress } from "~/components/ui/progress";

interface FormValues {
  email: string;
  surveyName: string;
  surveyContext: string;
  surveyFile: FileList;
}

const nameof = nameofFactory<FormValues>();

const surveyUploadSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  surveyName: Yup.string().required().label("Survey Name"),
  surveyContext: Yup.string().required().label("Survey Context"),
  surveyFile: Yup.mixed().required().label("Survey File"),
} as ShapeOf<FormValues>);

export default function SurveyUploadForm() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const defaultValues: FormValues = {
    email: "",
    surveyName: "",
    surveyContext: "",
    surveyFile: undefined as unknown as FileList,
  };

  const formContext = useForm({
    defaultValues,
    resolver: yupResolver(surveyUploadSchema) as Resolver<FormValues>,
    mode: "onChange",
    shouldUnregister: false,
  });

  const onSubmit = React.useCallback(async (values: FormValues) => {
    console.log("submit", values);
    // Simulate file upload
    for (let i = 0; i <= 100; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setUploadProgress(i);
    }
    // Reset progress after upload
    setTimeout(() => setUploadProgress(0), 1000);
  }, []);

  return (
    <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <div className="space-y-4">
        <RhfInput
          name={nameof("email")}
          label="Email"
          placeholder="Enter your email"
        />
        <RhfInput
          name={nameof("surveyName")}
          label="Survey Name"
          placeholder="Enter survey name"
        />
        <RhfTextarea
          name={nameof("surveyContext")}
          label="Survey Context"
          placeholder="Enter survey context"
          rows={4}
        />
        <RhfFileInput name={nameof("surveyFile")} label="Upload Survey" />
        {uploadProgress > 0 && (
          <Progress value={uploadProgress} className="w-full" />
        )}
        <FormSubmitButton>Upload Survey</FormSubmitButton>
      </div>
    </FormContainer>
  );
}
