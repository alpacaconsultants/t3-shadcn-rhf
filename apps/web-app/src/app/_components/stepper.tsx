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
import { useCallback } from 'react';
import { Uploader } from './uploader';
import { api } from '~/trpc/react';
import { SubmitButton } from '../ui/buttons/base-buttons';

enum StepId {
  Name,
  Upload,
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
  activeStep: number;
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
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'reset' }
  | { type: 'setValue'; payload: { key: keyof State['values']; value: string } }
  | { type: 'setFile'; payload: { file: File } }
  | { type: 'setUploadPercentage'; payload: { percentage: number } }
  | { type: 'setUploadStatus'; payload: { status: State['uploadStatus'] } };

const initialState: State = {
  activeStep: 0,
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

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next':
      state.activeStep++;
      break;
    case 'back':
      state.activeStep--;
      break;
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
  state.nextButton.label = state.activeStep === steps.length - 1 ? 'Finish' : 'Next';

  const activeId = steps[state.activeStep]?.id;
  state.nextButton.disabled = state.activeStep === steps.length - 1 ? true : undefined;
  state.backButton.disabled = state.activeStep === 0 ? true : undefined;
  if (activeId === StepId.Name) {
    state.nextButton.disabled = !state.values.name;
  }
  if (activeId === StepId.Upload) {
    state.nextButton.disabled = !state.file;
  }
  if (state.uploadStatus === 'uploading') {
    state.nextButton.disabled = true;
    state.backButton.disabled = true;
  }

  return state;
}

export default function VerticalLinearStepper(): JSX.Element {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const createSurvey = api.survey.create.useMutation({
    onSuccess: async (response) => {
      // eslint-disable-next-line no-console
      console.log('response!', response);
      await utils.survey.getAll.invalidate();
    },
  });

  const prepareUpload = api.survey.prepareUpload.useMutation();

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

  const handleNext = async () => {
    if (state.activeStep === steps.length - 1) {
      if (!state.file) return;
      const uploadInfo = await prepareUpload.mutateAsync({ fileName: state.file.name });
      const { s3Key, uploadUrl } = uploadInfo;
      await uploadFile(uploadUrl, state.file);
      await createSurvey.mutateAsync({ name: state.values.name, s3Key });
    }
    dispatch({ type: 'next' });
  };

  const handleBack = () => dispatch({ type: 'back' });
  const handleReset = () => dispatch({ type: 'reset' });

  const { activeStep, nextButton } = state;

  const utils = api.useUtils();

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
              {step.id === StepId.Name && (
                <TextField
                  sx={{ marginTop: 1 }}
                  value={state.values.name}
                  required
                  fullWidth
                  autoFocus
                  disabled={activeStep !== index}
                  placeholder='Survey name'
                  onChange={(e) => dispatch({ type: 'setValue', payload: { key: 'name', value: e.target.value } })}
                />
              )}
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <div>
                  {step.id === StepId.Upload && (
                    <>
                      <Uploader onDrop={(acceptedFiles: File[]) => dispatch({ type: 'setFile', payload: { file: acceptedFiles[0]! } })} />
                      {state.uploadStatus === 'uploading' && (
                        <LinearProgress
                          variant='determinate'
                          value={Math.min(100, Math.max(0, state.uploadPercentage))}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      )}
                    </>
                  )}
                  <SubmitButton variant='contained' onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                    {nextButton.label}
                  </SubmitButton>
                  <Button disabled={state.backButton.disabled} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {state.activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Done! We will send you an email when your survey insights are ready.</Typography>
        </Paper>
      )}
    </Box>
  );
}
