import { type InferSelectModel } from 'drizzle-orm';
import { type listSurveys } from '../data-layer/surveys';
import { type ExtractActionSucessData } from '../util/action-type-helpers';
import { insights, type surveys } from './schema';

export type Survey = InferSelectModel<typeof surveys>;

export type ListSurveysDto = ExtractActionSucessData<typeof listSurveys>[number];

const sentimentValues = insights.sentiment.enumValues;
type Sentiment = (typeof sentimentValues)[number];

// Define the return type for our query
export type InsightSummary = {
  topic: string | null;
  total: number;
} & {
  [K in Sentiment]: number;
};
