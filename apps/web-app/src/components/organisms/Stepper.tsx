'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';
import { useImmerReducer } from 'use-immer';
import axios from 'axios';
import { type FC, useCallback } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer } from '../molecules/forms/FormContainer';
import { RhfMuiSelect, RhfMuiTextArea, RhfMuiTextField } from '../molecules/fields/rhf-mui-fields';
import { RhfFileUpload } from '../molecules/fields/rhf-mui-fields/RhfFileUpload';
import { nameofFactory, type ShapeOf } from '../utils/type-helpers';
import FormSubmitButton from '../atoms/buttons/FormSubmitButton';
import { createSurvey, prepareUpload } from '~/server/data-layer/surveys';

enum StepId {
  Name = 0,
  Upload = 1,
}

interface Step {
  label: string;
  id: StepId;
}

const steps: Step[] = [
  {
    label: 'Give your survey a name',
    id: StepId.Name,
  },
  {
    id: StepId.Upload,
    label: 'Upload your survey',
  },
];

interface State {
  nextButton: {
    label: string;
    disabled?: boolean;
  };
  backButton: {
    disabled?: boolean;
  };

  uploadPercentage: number;
  uploadStatus: 'idle' | 'uploading' | 'uploaded';
}

type Action =
  | { type: 'reset' }
  | { type: 'setUploadPercentage'; payload: { percentage: number } }
  | { type: 'setUploadStatus'; payload: { status: State['uploadStatus'] } };

const initialState: State = {
  nextButton: {
    label: 'Next',
    disabled: true,
  },
  backButton: {
    disabled: false,
  },

  uploadPercentage: 0,
  uploadStatus: 'idle',
};

interface SurveyFormValues {
  name: string;
  activeStep: StepId;
  file: File | null;
}

const defaultValues: SurveyFormValues = {
  name: '',
  activeStep: StepId.Name,
  file: null,
};

const nameof = nameofFactory<SurveyFormValues>();

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'setUploadPercentage':
      state.uploadPercentage = action.payload.percentage;
      break;
    case 'setUploadStatus':
      state.uploadStatus = action.payload.status;
      break;
    default:
      throw new Error('Unexpected action type');
  }
  return state;
}

const surveyFormSchema = Yup.object().shape({
  name: Yup.string().when('activeStep', {
    is: StepId.Name,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  file: Yup.mixed().when('activeStep', {
    is: StepId.Upload,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
} as ShapeOf<SurveyFormValues>);

export default function VerticalLinearStepper(): JSX.Element {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const uploadFile = useCallback(
    async (uploadUrl: string, file: File) => {
      dispatch({ type: 'setUploadStatus', payload: { status: 'uploading' } });
      await axios.put(uploadUrl, file, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentage = Math.floor(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          dispatch({ type: 'setUploadPercentage', payload: { percentage } });
        },
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({ type: 'setUploadStatus', payload: { status: 'uploaded' } });
    },
    [dispatch]
  );

  const formContext = useForm({
    defaultValues,
    resolver: yupResolver(surveyFormSchema) as Resolver<SurveyFormValues>,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const {
    watch,
    formState: { isValid },
  } = formContext;

  const activeStep = watch('activeStep');

  const isLastStep = React.useMemo(() => +activeStep === steps.length - 1, [activeStep]);

  const handleNext = async (values: SurveyFormValues) => {
    if (+activeStep === steps.length - 1) {
      if (!values.file) return;
      const uploadInfo = await prepareUpload({ fileName: values.file.name });
      if (!uploadInfo?.data) throw new Error('Upload failed');
      const { s3Key, uploadUrl } = uploadInfo.data;
      await uploadFile(uploadUrl, values.file);
      await createSurvey({ name: values.name, s3Key });
    }
    formContext.setValue('activeStep', activeStep + 1, { shouldValidate: true });
  };

  const handleBack = async () => {
    formContext.setValue('activeStep', activeStep - 1), { shouldValidate: true };
    void formContext.trigger();
  };

  React.useEffect(() => {
    formContext.register('activeStep');
  }, [formContext]);

  return (
    <FormContainer formContext={formContext} onSuccess={handleNext}>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>
                {step.label}
                {step.id === StepId.Name && (
                  <RhfMuiTextField
                    name={nameof('name')}
                    label='Name'
                    placeholder='Survey name'
                    sx={{ marginTop: 1 }}
                    disabled={activeStep !== StepId.Name}
                  />
                )}
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <div>
                    {step.id === StepId.Upload && (
                      <>
                        <RhfFileUpload name={nameof('file')} />
                        {state.uploadStatus === 'uploading' && (
                          <LinearProgress
                            variant='determinate'
                            value={Math.min(100, Math.max(0, state.uploadPercentage))}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        )}
                      </>
                    )}
                    <FormSubmitButton variant='contained' sx={{ mt: 1, mr: 1 }} disabled={!isValid}>
                      {isLastStep ? 'Finish' : 'Next'}
                    </FormSubmitButton>
                    <Button disabled={formContext.formState.isSubmitting} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {+activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Done! We will send you an email when your survey insights are ready.</Typography>
          </Paper>
        )}
      </Box>
    </FormContainer>
  );
}
