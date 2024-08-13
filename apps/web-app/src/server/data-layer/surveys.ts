'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { z } from 'zod';
import { db } from '../db';
import { serverAction } from '../util/server-utils';

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
