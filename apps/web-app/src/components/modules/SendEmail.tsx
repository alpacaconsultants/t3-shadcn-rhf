'use client';

import { type FC } from 'react';
import { ProgressButton } from '../ui/atoms/buttons/BaseButtons';
import { sendEmail } from '~/server/util/send-email';

export const SendEmail: FC = () => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [surveys] = api.survey.getAll.useSuspenseQuery();

  <ProgressButton variant='contained' onClick={async () => await sendEmail()}>
    Send Email
  </ProgressButton>
);
