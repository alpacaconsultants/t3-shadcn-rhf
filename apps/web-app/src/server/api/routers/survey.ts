import { z } from 'zod';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { surveys } from '~/server/db/schema';

export const surveyRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ name: z.string().min(1), fileName: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const s3Key = `${ctx.session.user.id}/${input.name}/${input.fileName}`;
    const [newSurvey] = await ctx.db
      .insert(surveys)
      .values({
        name: input.name,
        createdById: ctx.session.user.id,
        s3Key,
      })
      .returning();

    const command = new PutObjectCommand({
      Key: 'file.txt',
      Bucket: Resource.SurveyBucket.name,
    });
    const uploadUrl = await getSignedUrl(new S3Client({}), command);

    return { ...newSurvey, uploadUrl };
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const surveys = await ctx.db.query.surveys.findMany({
      orderBy: (survey, { desc }) => [desc(survey.createdAt)],
    });

    return surveys ?? null;
  }),
});
