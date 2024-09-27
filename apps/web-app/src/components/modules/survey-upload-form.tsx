"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useImmerReducer } from "use-immer";
import { useCallback } from "react";
import axios from "axios";
import { RhfFileUpload } from "../rhf-file-input";
import { nameofFactory, type ShapeOf } from "~/components/utils/type-helpers";
import { FormContainer } from "~/components/form/form-container";
import { RhfInput } from "~/components/rhf-input";
import { RhfTextarea } from "~/components/rhf-text-area";
import FormSubmitButton from "~/components/ui/form-submit-button";
import { Progress } from "~/components/ui/progress";
import { prepareUpload, createSurvey } from "~/server/data-layer/surveys";
import { env } from "~/env";

interface FormValues {
  email: string;
  surveyName: string;
  surveyContext: string;
  surveyFile: File | null;
}

const nameof = nameofFactory<FormValues>();

const surveyUploadSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  surveyName: Yup.string().required().label("Survey Name"),
  surveyContext: Yup.string().required().label("Survey Context"),
  surveyFile: Yup.mixed().required().label("Survey File"),
} as ShapeOf<FormValues>);

interface State {
  uploadPercentage: number;
  uploadStatus: "idle" | "uploading" | "uploaded";
}

type Action =
  | { type: "reset" }
  | { type: "setUploadPercentage"; payload: { percentage: number } }
  | { type: "setUploadStatus"; payload: { status: State["uploadStatus"] } };

const initialState: State = {
  uploadPercentage: 0,
  uploadStatus: "idle",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setUploadPercentage":
      state.uploadPercentage = action.payload.percentage;
      break;
    case "setUploadStatus":
      state.uploadStatus = action.payload.status;
      break;
    default:
      throw new Error("Unexpected action type");
  }
  return state;
}

export default function SurveyUploadForm() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const defaultValues: FormValues = {
    email: "",
    surveyName: "",
    surveyContext: "",
    surveyFile: null,
  };

  const formContext = useForm({
    defaultValues,
    resolver: yupResolver(surveyUploadSchema) as Resolver<FormValues>,
    mode: "onChange",
    shouldUnregister: false,
  });

  const values = formContext.watch();

  const uploadFile = useCallback(
    async (uploadUrl: string, file: File) => {
      dispatch({ type: "setUploadStatus", payload: { status: "uploading" } });
      await axios.put(uploadUrl, file, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentage = Math.floor(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
          dispatch({ type: "setUploadPercentage", payload: { percentage } });
        },
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "setUploadStatus", payload: { status: "uploaded" } });
    },
    [dispatch],
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const file = values.surveyFile;

      if (!file) return;

      // Prepare the upload URL and other metadata
      const uploadInfo = await prepareUpload({
        fileName: file.name,
        userEmail: values.email,
      });
      if (!uploadInfo?.data) throw new Error("Upload failed");
      const { s3Key, uploadUrl } = uploadInfo.data;

      // Upload the file
      await uploadFile(uploadUrl, file);

      // Create the survey entry
      await createSurvey({
        name: values.surveyName,
        s3Key,
        context: values.surveyContext,
        userEmail: values.email,
      });

      if (env.NEXT_PUBLIC_NODE_ENV === "development") {
        // Allow form submission again for development purposes
        dispatch({ type: "reset" });
      }
    },
    [dispatch, uploadFile],
  );

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
        <RhfFileUpload name={nameof("surveyFile")} label="Upload Survey" />
        {state.uploadStatus === "uploading" && (
          <Progress value={state.uploadPercentage} className="w-full" />
        )}
        <FormSubmitButton>Upload Survey</FormSubmitButton>
      </div>
    </FormContainer>
  );
}
