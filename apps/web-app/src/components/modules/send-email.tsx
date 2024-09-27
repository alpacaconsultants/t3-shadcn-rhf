"use client";

import { type FC } from "react";
import { ProgressButton } from "../ui/progress-button";
import { sendEmail } from "~/server/email/send-email";

export const SendEmail: FC = () => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [surveys] = api.survey.getAll.useSuspenseQuery();

  <ProgressButton
    onClick={async () => {
      await sendEmail();
    }}
  >
    Send Email
  </ProgressButton>
);
