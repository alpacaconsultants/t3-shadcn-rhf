import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { SurveyUploadForm } from "~/components/modules/survey-upload-form";
import { HomeContent } from "~/components/home-content";
import Header from "~/components/header";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <HomeContent />
        {/* {session && <Link href="/admin">Admin Page</Link>} */}
        {/* <CreateSurveyForm defaultEmail={session?.user.email ?? undefined} /> */}
        {/* <SampleForm /> */}
        {/* <NameAddressForm /> */}
        {/* <AddressForm /> */}
        {/* <AddressContactForm /> */}

        {/* <SurveyUploadForm defaultEmail={session?.user.email ?? undefined} /> */}

        {/* <SurveyUploadForm defaultEmail={session?.user.email ?? undefined} /> */}
        {/* <SendEmail /> */}
      </div>
    </HydrateClient>
  );
}
