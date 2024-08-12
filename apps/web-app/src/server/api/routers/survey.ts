import { z } from 'zod';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { surveys } from '~/server/db/schema';

const s3 = new S3Client({});

export const surveyRouter = createTRPCRouter({
  prepareUpload: protectedProcedure.input(z.object({ fileName: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const s3Key = `${ctx.session.user.id}/${new Date().getTime()}/${input.fileName}`;
    const command = new PutObjectCommand({
      Key: s3Key,
      Bucket: Resource.SurveyBucket.name,
    });
    const uploadUrl = await getSignedUrl(s3, command);
    return { s3Key, uploadUrl };
  }),
  create: protectedProcedure.input(z.object({ name: z.string().min(1), s3Key: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const [newSurvey] = await ctx.db
      .insert(surveys)
      .values({
        name: input.name,
        createdById: ctx.session.user.id,
        s3Key: input.s3Key,
      })
      .returning();
    return newSurvey;
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const surveys = await ctx.db.query.surveys.findMany({
      orderBy: (survey, { desc }) => [desc(survey.createdAt)],
    });

    return surveys ?? null;
  }),
});
