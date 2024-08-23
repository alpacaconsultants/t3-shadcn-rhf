import { type NextRequest } from 'next/server';

export const SEARCH_PARAM_SURVERY_ID = 'surveyId';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surveryIdStr = searchParams.get(SEARCH_PARAM_SURVERY_ID);
  if (!surveryIdStr) return Response.json({ error: 'Survey ID is required' }, { status: 400 });
  const surveyId = +surveryIdStr;
  console.log('surveryId', surveyId);
  return Response.json({ status: 200, message: 'OK' });
}
