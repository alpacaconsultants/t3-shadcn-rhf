import { SurveysTable } from "~/components/modules/surveys-table";

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  //

  // return <Box>{JSON.stringify(surveys)}</Box>;

  return <SurveysTable />;
}
