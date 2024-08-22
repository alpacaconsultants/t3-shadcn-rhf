import Link from 'next/link';
import { Box } from '@mui/material';
import { getServerAuthSession } from '~/server/auth';
import { HydrateClient } from '~/trpc/server';
import { Surveys } from '~/components/modules/Surverys';

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  //
  const session = await getServerAuthSession();

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
        <Link href={`/admin/${1}`}>Admin Page 1</Link>
        {session && <Surveys />}
      </Box>
    </HydrateClient>
  );
}
