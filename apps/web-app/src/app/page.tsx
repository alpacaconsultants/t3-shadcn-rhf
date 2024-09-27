import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import SurveyUploadForm from "~/components/modules/survey-upload-form";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? "Sign out" : "Sign in"}
        </Link>
        {session && <Link href="/admin">Admin Page</Link>}
        {/* <CreateSurveyForm defaultEmail={session?.user.email ?? undefined} /> */}
        {/* <SampleForm /> */}
        {/* <NameAddressForm /> */}
        {/* <AddressForm /> */}
        {/* <AddressContactForm /> */}
        <SurveyUploadForm />
        {/* <SendEmail /> */}
      </div>
    </HydrateClient>
  );
}
