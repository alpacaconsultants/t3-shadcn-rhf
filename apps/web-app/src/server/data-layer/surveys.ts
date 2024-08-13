'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { getServerAuthSession } from '../auth';
import { db } from '../db';

const s3 = new S3Client({});

// Assume we have a Session type defined somewhere
type Session = Awaited<ReturnType<typeof getServerAuthSession>>;

// Define a more specific type for server actions that includes the session
type AuthenticatedServerAction<Args extends unknown[], Return> = (session: Session, ...args: Args) => Promise<Return>;

// Create a higher-order function for authentication
function withAuth<Args extends unknown[], Return>(action: AuthenticatedServerAction<Args, Return>): (...args: Args) => Promise<Return> {
  return async (...args: Args): Promise<Return> => {
    const session = await getServerAuthSession();

    if (!session || !session.user) {
      throw new Error('Not authenticated');
    }

    // If authentication passes, execute the original action with session
    return action(session, ...args);
  };
}

export const prepareUpload = withAuth(async (session: Session, fileName: string) => {
  const s3Key = `${session?.user.id}/${new Date().getTime()}/${fileName}`;
  const command = new PutObjectCommand({
    Key: s3Key,
    Bucket: Resource.SurveyBucket.name,
  });
  const uploadUrl = await getSignedUrl(s3, command);
  return { s3Key, uploadUrl };
});

export const getMySurveys = withAuth(async () => {
  const surveys = await db.query.surveys.findMany({
    orderBy: (survey, { desc }) => [desc(survey.createdAt)],
  });

  return surveys ?? null;
});
