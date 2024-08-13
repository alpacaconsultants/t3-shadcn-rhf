'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { getServerAuthSession } from '../auth';
import { db } from '../db';

const s3 = new S3Client({});

export const prepareUpload = async (fileName: string) => {
  const session = await getServerAuthSession();
  const s3Key = `${session?.user.id}/${new Date().getTime()}/${fileName}`;
  const command = new PutObjectCommand({
    Key: s3Key,
    Bucket: Resource.SurveyBucket.name,
  });
  const uploadUrl = await getSignedUrl(s3, command);
  return { s3Key, uploadUrl };
};

export const getMySurveys = async () => {
  const session = await getServerAuthSession();
  const surveys = await db.query.surveys.findMany({
    orderBy: (survey, { desc }) => [desc(survey.createdAt)],
  });

  return surveys ?? null;
};
