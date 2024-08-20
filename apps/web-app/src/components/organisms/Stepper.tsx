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
import { LinearProgress, TextField } from '@mui/material';
import { useImmerReducer } from 'use-immer';
import axios from 'axios';
import { type FC, useCallback } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProgressButton } from '../atoms/buttons/BaseButtons';
import { FormContainer } from '../molecules/forms/FormContainer';
import { RhfMuiSelect, RhfMuiTextArea, RhfMuiTextField } from '../molecules/fields/rhf-mui-fields';
import { RhfFileUpload } from '../molecules/fields/rhf-mui-fields/RhfFileUpload';
import { nameofFactory, type ShapeOf } from '../utils/type-helpers';
import { FileUploader } from './FileUploader';
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
  // activeStep: number;
  nextButton: {
    label: string;
    disabled?: boolean;
  };
  backButton: {
    disabled?: boolean;
  };
  file: File | null;
  values: {
    name: string;
  };
  uploadPercentage: number;
  uploadStatus: 'idle' | 'uploading' | 'uploaded';
}

type Action =
  // | { type: 'next' }
  // | { type: 'back' }
  | { type: 'reset' }
  | { type: 'setValue'; payload: { key: keyof State['values']; value: string } }
  | { type: 'setFile'; payload: { file: File } }
  | { type: 'setUploadPercentage'; payload: { percentage: number } }
  | { type: 'setUploadStatus'; payload: { status: State['uploadStatus'] } };

const initialState: State = {
  // activeStep: 0,
  nextButton: {
    label: 'Next',
    disabled: true,
  },
  backButton: {
    disabled: false,
  },
  values: {
    name: '',
  },
  file: null,
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
    // case 'next':
    //   state.activeStep++;
    //   break;
    // case 'back':
    //   state.activeStep--;
    //   break;
    case 'setValue':
      state.values[action.payload.key] = action.payload.value;
      break;
    case 'setFile':
      state.file = action.payload.file;
      break;
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
  // state.nextButton.label = state.activeStep === steps.length - 1 ? 'Finish' : 'Next';

  // const activeId = steps[state.activeStep]?.id;
  // state.nextButton.disabled = state.activeStep === steps.length - 1 ? true : undefined;
  // state.backButton.disabled = state.activeStep === 0 ? true : undefined;
  // if (activeId === StepId.Name) {
  //   state.nextButton.disabled = !state.values.name;
  // }
  // if (activeId === StepId.Upload) {
  //   state.nextButton.disabled = !state.file;
  // }
  // if (state.uploadStatus === 'uploading') {
  //   state.nextButton.disabled = true;
  //   state.backButton.disabled = true;
  // }

  return state;
}

const myDefaultValues = {
  name: 'test',
  description: '',
  gender: '',
};

export const SampleForm: FC = () => {
  const formContext = useForm({
    defaultValues: myDefaultValues,
  });

  const values = formContext.watch();

  return (
    <FormContainer formContext={formContext}>
      <Box>{JSON.stringify(values)}</Box>
      <RhfMuiTextField name='name' label='Name' />
      <RhfMuiSelect name='gender' label='Gender' options={[{ id: 'male', label: 'Male' }]} />
      <RhfMuiTextArea name='description' label='Description' />
      <RhfFileUpload name='file' />
    </FormContainer>
  );
};

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

function FormValueDisplay() {
  const formValues = useWatch();
  return <pre>{JSON.stringify(formValues, null, 2)}</pre>;
}

export default function VerticalLinearStepper(): JSX.Element {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // const createSurvey = api.survey.create.useMutation({
  //   onSuccess: async (response) => {
  //     // eslint-disable-next-line no-console
  //     console.log('response!', response);
  //     await utils.survey.getAll.invalidate();
  //   },
  // });

  // const prepareUpload = api.survey.prepareUpload.useMutation();

  const uploadFile = useCallback(
    async (uploadUrl: string, file: File) => {
      dispatch({ type: 'setUploadStatus', payload: { status: 'uploading' } });
      await axios.put(uploadUrl, file, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentage = Math.floor(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          // eslint-disable-next-line no-console
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
    resolver: yupResolver(surveyFormSchema),
    mode: 'onChange',
    shouldUnregister: false,
  });

  const {
    watch,
    formState: { isValid },
  } = formContext;

  const activeStep = watch('activeStep') as StepId;

  const handleNext = async () => {
    if (+activeStep === steps.length - 1) {
      if (!state.file) return;
      const uploadInfo = await prepareUpload({ fileName: state.file.name });
      if (!uploadInfo?.data) throw new Error('Upload failed');
      const { s3Key, uploadUrl } = uploadInfo.data;
      await uploadFile(uploadUrl, state.file);
      await createSurvey({ name: state.values.name, s3Key });
    }
    // dispatch({ type: 'next' });
    formContext.setValue('activeStep', activeStep + 1, { shouldValidate: true });
  };

  const handleBack = async () => {
    formContext.setValue('activeStep', activeStep - 1), { shouldValidate: true };
    void formContext.trigger();
  };
  const { nextButton } = state;

  const formValues = formContext.watch();

  React.useEffect(() => {
    formContext.register('activeStep');
  }, [formContext]);

  // React.useEffect(() => {
  //   void formContext.trigger();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeStep]);

  return (
    <FormContainer formContext={formContext}>
      <Box>{JSON.stringify(formValues)}</Box>
      <Button
        onClick={() => {
          void formContext.trigger();
        }}
      >
        Validate
      </Button>
      <FormValueDisplay />
      <Box>{JSON.stringify(formContext.formState.isValid)}</Box>
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
                    <ProgressButton variant='contained' type='button' onClick={handleNext} sx={{ mt: 1, mr: 1 }} disabled={!isValid}>
                      Next
                    </ProgressButton>
                    <Button disabled={state.backButton.disabled} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
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
