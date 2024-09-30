import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Suspense } from "react";
import { TRPCReactProvider } from "~/trpc/react";
import { ClientProviders } from "~/components/utils/client-providers";
import Header from "~/components/header";

export const metadata: Metadata = {
  title: "Strixy",
  description: "Survey analytics redefined",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <TRPCReactProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientProviders>
              <Header />
              {children}{" "}
            </ClientProviders>
          </Suspense>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
