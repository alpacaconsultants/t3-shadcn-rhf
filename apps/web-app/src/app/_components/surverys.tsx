'use client';

import { type FC } from 'react';
import VerticalLinearStepper from './stepper';
import { api } from '~/trpc/react';

export const Surveys: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [surveys] = api.survey.getAll.useSuspenseQuery();

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
