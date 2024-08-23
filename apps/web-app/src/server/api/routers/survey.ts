import z from 'zod';
// import { surveys } from '~/server/db/schema';

// const s3 = new S3Client({});
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const surveyRouter = createTRPCRouter({
  processedCallback: publicProcedure.input(z.object({ surveyId: z.number() })).query(async ({ input }) => {
    // eslint-disable-next-line no-console
    console.log('prepareUpload', input);
    return true;
  }),
});
