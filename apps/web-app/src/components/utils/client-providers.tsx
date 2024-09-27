"use client";

import { SessionProvider } from "next-auth/react";
import { type FC, type PropsWithChildren } from "react";

export const ClientProviders: FC<PropsWithChildren<unknown>> = ({
  children,
}) => <SessionProvider>{children}</SessionProvider>;
