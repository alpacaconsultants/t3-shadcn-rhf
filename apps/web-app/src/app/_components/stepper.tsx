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
}

type Action = { type: 'next' } | { type: 'back' } | { type: 'reset' };

const initialState: State = {
  activeStep: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next':
      return { ...state, activeStep: state.activeStep + 1 };
    case 'back':
      return { ...state, activeStep: state.activeStep - 1 };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

export default function VerticalLinearStepper(): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleNext = () => dispatch({ type: 'next' });
  const handleBack = () => dispatch({ type: 'back' });
  const handleReset = () => dispatch({ type: 'reset' });

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={state.activeStep} orientation='vertical'>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
              {step.id === StepId.Name && <TextField required fullWidth autoFocus disabled={state.activeStep !== index} placeholder='Survey name' />}
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button variant='contained' onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
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
