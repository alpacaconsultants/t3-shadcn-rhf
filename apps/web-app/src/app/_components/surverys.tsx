'use client';

import { type FC, useState } from 'react';

import { Box } from '@mui/material';
import styles from '../index.module.css';
import VerticalLinearStepper from './stepper';
import { api } from '~/trpc/react';

export const Surveys: FC = () => {
  const [surveys] = api.survey.getAll.useSuspenseQuery();

  const utils = api.useUtils();

  return <VerticalLinearStepper />;

  // return (
  //   <Box>
  //     {surveys.length === 0 ? <p>No surveys</p> : null}
  //     {surveys.map((survey) => (
  //       <div key={survey.id}>{survey.name}</div>
  //     ))}
  //   </Box>
  // );
};
