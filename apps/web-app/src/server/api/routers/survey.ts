import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { surveys } from '~/server/db/schema';

export const surveyRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(surveys).values({
      name: input.name,
      createdById: ctx.session.user.id,
    });
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const surveys = await ctx.db.query.surveys.findMany({
      orderBy: (survey, { desc }) => [desc(survey.createdAt)],
    });

    return surveys ?? null;
  }),
});
