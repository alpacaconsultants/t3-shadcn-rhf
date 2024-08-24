'use server';

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { render } from '@react-email/components';
import { Resource } from 'sst';
import { actionClient } from '../util/safe-action';
import { docEmail, Email } from './emails/email';
import NikeReceiptEmail from './emails/nike-reciept';
import StirxyWelcomeEmail from './emails/thank-you';

const client = new SESv2Client();

export const sendEmail = actionClient.action(async () => {
  const emailHtml = await render(StirxyWelcomeEmail());

  console.log('emailHtml', emailHtml);

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: `simon@${Resource.EmailAlpaca.sender}`,
      Destination: {
        ToAddresses: ['simonaverhoeven@gmail.com'],
      },
      Content: {
        Simple: {
          Subject: { Data: 'We are processing your survey' },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: emailHtml,
            },
          },
        },
      },
    })
  );

  // try {
  //   await client.send(
  //     new SendEmailCommand({
  //       FromEmailAddress: `simon@${Resource.EmailAlpaca.sender}`,
  //       Destination: {
  //         ToAddresses: ['simonaverhoeven@gmail.com'],
  //       },
  //       Content: {
  //         Simple: {
  //           Subject: {
  //             Charset: 'UTF-8',
  //             Data: 'Html Test',
  //           },
  //           Body: {
  //             Html: {
  //               Charset: 'UTF-8',
  //               Data: '<html><body><h1>Test HTML Email</h1><p>This is a test.</p></body></html>',
  //             },
  //           },
  //         },
  //       },
  //     })
  //   );
  // } catch (error) {
  //   console.error('Error sending email!!!!', error);
  // }
  console.log('email sent!!!');
});
