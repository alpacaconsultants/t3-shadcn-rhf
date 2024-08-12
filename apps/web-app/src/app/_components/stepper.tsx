import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { useImmerReducer } from 'use-immer';
import { Uploader } from './uploader';
import { api } from '~/trpc/react';

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
    disabled: boolean;
  };
  values: {
    name: string;
    file: string;
  };
}

type Action =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'reset' }
  | { type: 'setValue'; payload: { key: keyof State['values']; value: string } };

const initialState: State = {
  activeStep: 0,
  nextButton: {
    label: 'Next',
    disabled: true,
  },
  values: {
    name: '',
    file: '',
  },
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
    case 'reset':
      return initialState;

    default:
      throw new Error('Unexpected action type');
      break;
  }
  state.nextButton.label = state.activeStep === steps.length - 1 ? 'Finish' : 'Next';
  state.nextButton.disabled = state.activeStep === steps.findIndex((step) => step.id === StepId.Name) && !state.values.name;
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

  const handleNext = async () => {
    if (state.activeStep === steps.length - 1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newSurvey = await createSurvey.mutateAsync({ name: state.values.name, fileName: 'test.csv' });
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
                  {step.id === StepId.Upload && <Uploader />}
                  <Button variant='contained' onClick={handleNext} sx={{ mt: 1, mr: 1 }} disabled={nextButton.disabled}>
                    {nextButton.label}
                  </Button>
                  <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
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
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
