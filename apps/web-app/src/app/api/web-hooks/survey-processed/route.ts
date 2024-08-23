import { eq } from 'drizzle-orm';
import { type NextRequest } from 'next/server';
import { db } from '~/server/db';
import { surveys } from '~/server/db/schema';

export const SEARCH_PARAM_SURVERY_ID = 'surveyId';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surveryIdStr = searchParams.get(SEARCH_PARAM_SURVERY_ID);
  if (!surveryIdStr) return Response.json({ error: 'Survey ID is required' }, { status: 400 });
  const surveyId = +surveryIdStr;
  console.log('surveryId', surveyId);

  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.id, surveyId),
  });

  if (!survey) return Response.json({ error: 'Survey not found' }, { status: 404 });

  console.log('survey', survey.s3Key);

  return Response.json({ status: 200, message: 'OK' });
}
