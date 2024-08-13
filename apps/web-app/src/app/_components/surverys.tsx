'use server';

import { type FC } from 'react';
import VerticalLinearStepper from './stepper';
import { getMySurveys } from '~/server/data-layer/surveys';

export const Surveys: FC = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [surveys] = api.survey.getAll.useSuspenseQuery();

  const mySurveys = await getMySurveys();

  // eslint-disable-next-line no-console
  console.log('mySurveys', mySurveys);

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
