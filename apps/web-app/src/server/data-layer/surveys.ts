'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { z } from 'zod';
import { db } from '../db';
import { authActionClient } from '../util/safe-action';
import { surveys } from '~/server/db/schema';

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

export const createSurvey = authActionClient
  .schema(z.object({ name: z.string().min(1), s3Key: z.string().min(1) }))
  .action(async ({ ctx, parsedInput }) => {
    const [newSurvey] = await db
      .insert(surveys)
      .values({
        name: parsedInput.name,
        createdById: ctx.user.id,
        s3Key: parsedInput.s3Key,
      })
      .returning();
    return newSurvey;
  });
