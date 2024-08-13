'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { z } from 'zod';
import { db } from '../db';
import { serverAction } from '../util/server-utils';
import { surveys } from '~/server/db/schema';

const s3 = new S3Client({});

export const prepareUpload = serverAction()
  .auth()
  .input(z.object({ fileName: z.string().min(1) }))
  .action(async ({ session, input }) => {
    const s3Key = `${session?.user.id}/${new Date().getTime()}/${input.fileName}`;
    const command = new PutObjectCommand({
      Key: s3Key,
      Bucket: Resource.SurveyBucket.name,
    });
    const uploadUrl = await getSignedUrl(s3, command);
    return { s3Key, uploadUrl };
  });

export const getMySurveys = serverAction()
  .auth()
  .action(async () => {
    const surveys = await db.query.surveys.findMany({
      orderBy: (survey, { desc }) => [desc(survey.createdAt)],
    });
    return surveys ?? null;
  });

export const createSurvey = serverAction()
  .auth()
  .input(z.object({ name: z.string().min(1), s3Key: z.string().min(1) }))
  .action(async ({ session, input }) => {
    if (!session) return null;
    const [newSurvey] = await db
      .insert(surveys)
      .values({
        name: input.name,
        createdById: session.user.id,
        s3Key: input.s3Key,
      })
      .returning();
    return newSurvey;
  });
