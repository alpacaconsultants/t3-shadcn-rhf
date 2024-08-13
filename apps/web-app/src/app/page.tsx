import Link from 'next/link';
import { Box } from '@mui/material';
import { Surveys } from './_components/surverys';
import { getServerAuthSession } from '~/server/auth';
import { HydrateClient } from '~/trpc/server';

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  //
  const session = await getServerAuthSession();

  // console.log('session', session);

  return (
    <HydrateClient>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          // backgroundImage: 'linear-gradient(to bottom, #2e026d, #15162c)',
        }}
      >
        <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>{session ? 'Sign out' : 'Sign in'}</Link>
        {session && <Surveys />}
      </Box>
    </HydrateClient>
  );
}
