'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SessionProvider } from 'next-auth/react';
import { type FC, type PropsWithChildren } from 'react';

export const ClientProviders: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <SessionProvider>
    <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
  </SessionProvider>
);
