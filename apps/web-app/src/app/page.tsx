import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import { HydrateClient } from '~/trpc/server';
import { CreateSurveyForm } from '~/components/modules/CreateSurveyForm';
import { SendEmail } from '~/components/modules/SendEmail';

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
          {session ? 'Sign out' : 'Sign in'}
        </Link>
        {session && <Link href='/admin'>Admin Page</Link>}
        <CreateSurveyForm defaultEmail={session?.user.email ?? undefined} />
        <SendEmail />
      </div>
    </HydrateClient>
  );
}
