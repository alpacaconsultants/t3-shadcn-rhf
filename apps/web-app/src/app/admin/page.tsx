import { Box } from '@mui/material';
import { SurveysTable } from '~/components/modules/SurveysTable';
import { listSurveys } from '~/server/data-layer/surveys';

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  //

  const surveys = await listSurveys();

  // return <Box>{JSON.stringify(surveys)}</Box>;

  return <SurveysTable />;
}
