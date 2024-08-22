'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { actionClient, authActionClient } from '../util/safe-action';
import { surveys, users } from '~/server/db/schema';

const s3 = new S3Client({});

export const prepareUpload = authActionClient
  // .metadata({ actionName: 'prepareUpload' })
  .schema(z.object({ fileName: z.string().min(1) }))
  .action(async ({ parsedInput, ctx }) => {
    const s3Key = `${ctx?.user.id}/${new Date().getTime()}/${parsedInput.fileName}`;
    const command = new PutObjectCommand({
      Key: s3Key,
      Bucket: Resource.SurveyBucket.name,
    });
    const uploadUrl = await getSignedUrl(s3, command);
    return { s3Key, uploadUrl };
  });

export const getMySurveys = authActionClient.action(async () => {
  const surveys = await db.query.surveys.findMany({
    orderBy: (survey, { desc }) => [desc(survey.createdAt)],
  });
  return surveys ?? null;
});

export const createSurvey = actionClient
  .schema(z.object({ name: z.string().min(1), s3Key: z.string().min(1), description: z.string().optional(), userEmail: z.string() }))
  .action(async ({ parsedInput }) => {
    let user = await db.query.users.findFirst({
      where: eq(users.email, parsedInput.userEmail),
    });
    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: parsedInput.userEmail,
        })
        .returning();
      user = newUser;
    }

    if (!user) throw new Error('User not found');

    const [newSurvey] = await db
      .insert(surveys)
      .values({
        name: parsedInput.name,
        createdById: user?.id,
        s3Key: parsedInput.s3Key,
        description: parsedInput.description,
      })
      .returning();
    return newSurvey;
  });
