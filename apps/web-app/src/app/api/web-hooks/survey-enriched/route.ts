/* eslint-disable no-console */
import { type Readable } from 'stream';
import { eq } from 'drizzle-orm';
import { type NextRequest } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'papaparse';
import { Resource } from 'sst';
import { z } from 'zod';
import _ from 'lodash';
import { SEARCH_PARAM_SURVERY_ID } from '~/server/config';
import { db } from '~/server/db';
import { insights, surveys } from '~/server/db/schema';

const s3 = new S3Client(); // Replace with your S3 region

// Define the Zod schema for a single row of CSV data
const InsightSchema = z
  .object({
    Reference: z.string().transform(Number),
    Topic: z.string().optional(),
    Sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  })
  .catchall(z.unknown()); // Allow additional fields

// Define the schema for the entire CSV
const CSVSchema = z.array(InsightSchema);

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

  try {
    // Get the object from S3
    const command = new GetObjectCommand({
      Bucket: Resource.BucketSurveyEnriched.name, // Replace with your bucket name
      Key: survey.s3Key,
    });

    const response = await s3.send(command);

    if (!response.Body) {
      throw new Error('No body in S3 response');
    }

    const csvString = await response.Body.transformToString();

    // Parse the CSV
    const results = parse(csvString, {
      header: true,
      skipEmptyLines: true,
    });

    // Validate the parsed data
    const validatedData = CSVSchema.parse(results.data);

    const newInsights = validatedData.map((data) => ({
      surveyId: survey.id,
      reference: data.Reference,
      topic: data.Topic,
      sentiment: data.Sentiment,
      originalData: JSON.stringify(_.omit(data, ['Reference', 'Topic', 'Sentiment'])),
    }));

    await db.delete(insights).where(eq(insights.surveyId, survey.id));
    await db.insert(insights).values(newInsights).returning();

    return Response.json({ status: 'OK' });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return Response.json({ error: 'Failed to process CSV' }, { status: 500 });
  }

  return Response.json({ status: 200, message: 'OK' });
}
