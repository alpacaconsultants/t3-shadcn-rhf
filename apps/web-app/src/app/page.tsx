import Link from 'next/link';
import { makeStyles } from 'tss-react/mui';
import { Box } from '@mui/material';
import styles from './index.module.css';
import { LatestPost } from '~/app/_components/post';
import { getServerAuthSession } from '~/server/auth';
import { HydrateClient, api } from '~/trpc/server';

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(to bottom, #2e026d, #15162c)',
        }}
      >
        <Link className={styles.loginButton} href={session ? '/api/auth/signout' : '/api/auth/signin'}>
          {session ? 'Sign out' : 'Sign in'}
        </Link>
      </Box>
    </HydrateClient>
  );
}
