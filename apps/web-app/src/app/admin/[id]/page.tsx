import { Box } from '@mui/material';

export default async function Home({ params }: { params: { id: string } }) {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  //

  return <Box>admin page {params.id}</Box>;
}
