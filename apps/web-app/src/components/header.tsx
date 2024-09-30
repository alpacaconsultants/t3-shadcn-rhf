import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-[#D8CCB6] px-4 py-3 shadow-md">
      <Link href="/" className="text-lg font-bold" prefetch={false}>
        STRIXY
      </Link>
      <div className="flex h-14 w-14 items-center justify-center">
        <Link href="/" className="text-lg font-bold" prefetch={false}>
          <Image src="/logo.svg" alt="Logo" width={150} height={150} />
        </Link>
      </div>
      <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
        {session ? "Sign out" : "Sign in"}
      </Link>
    </header>
  );
}
