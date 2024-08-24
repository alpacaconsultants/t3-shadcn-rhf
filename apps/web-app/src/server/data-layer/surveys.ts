'use server';

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { Resource } from 'sst';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { type Route } from 'next';
import { db } from '../db';
import { actionClient, authActionClient } from '../util/safe-action';
import { SEARCH_PARAM_SURVERY_ID } from '../config';
import { surveys, users } from '~/server/db/schema';
import { env } from '~/env';

const client = new SESv2Client();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3100/',
  headers: {
    api_key: 'f2491365539c99daef760c0db4881bf5',
  },
});

const s3 = new S3Client({});

const findOrCreateUser = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (user) return user;
  const [newUser] = await db
    .insert(users)
    .values({
      email,
    })
    .returning();
  return newUser;
};

export const prepareUpload = actionClient
  // .metadata({ actionName: 'prepareUpload' })
  .schema(z.object({ fileName: z.string().min(1), userEmail: z.string() }))
  .action(async ({ parsedInput }) => {
    const user = await findOrCreateUser(parsedInput.userEmail);
    if (!user) throw new Error('User not found');

    const s3Key = `${user.id}/${new Date().getTime()}/${parsedInput.fileName}`;
    const command = new PutObjectCommand({
      Key: s3Key,
      Bucket: Resource.BucketSurveyUploads.name,
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 7 days in seconds
    return { s3Key, uploadUrl };
  });

export const getMySurveys = authActionClient.action(async () => {
  const surveys = await db.query.surveys.findMany({
    orderBy: (survey, { desc }) => [desc(survey.createdAt)],
  });
  return surveys ?? null;
});

export const createSurvey = actionClient
  .schema(z.object({ name: z.string().min(1), s3Key: z.string().min(1), context: z.string().optional(), userEmail: z.string() }))
  .action(async ({ parsedInput }) => {
    const user = await findOrCreateUser(parsedInput.userEmail);

    if (!user) throw new Error('User not found');

    const [newSurvey] = await db
      .insert(surveys)
      .values({
        name: parsedInput.name,
        createdById: user.id,
        s3Key: parsedInput.s3Key,
        context: parsedInput.context,
      })
      .returning();

    if (!newSurvey) throw new Error('Survey not found');

    const downloadUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Key: parsedInput.s3Key,
        Bucket: Resource.BucketSurveyUploads.name,
      }),
      { expiresIn: 7 * 24 * 60 * 60 }
    ); // 7 days in seconds

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Key: parsedInput.s3Key,
        Bucket: Resource.BucketSurveyEnriched.name,
      }),
      { expiresIn: 7 * 24 * 60 * 60 }
    ); // 7 days in seconds

    const webhookPath: Route = '/api/web-hooks/survey-enriched';

    // // Note: I could use trpc here but I'm not sure if it's worth it
    await axiosInstance.post('/', {
      downloadUrl,
      uploadUrl,
      callbackUrl: `${env.APP_URL}${webhookPath}?${SEARCH_PARAM_SURVERY_ID}=${newSurvey.id}`,
      context: parsedInput.context,
    });
    return newSurvey;
  });

// export const sendEmail = actionClient.action(async () => {
//   await client.send(
//     new SendEmailCommand({
//       FromEmailAddress: `simon@${Resource.EmailAlpaca.sender}`,
//       Destination: {
//         ToAddresses: ['simonaverhoeven@gmail.com'],
//       },
//       Content: {
//         Simple: {
//           Subject: { Data: 'Hello World!' },
//           Body: { Text: { Data: 'Sent from my SST app.' } },
//         },
//       },
//     })
//   );
// });
