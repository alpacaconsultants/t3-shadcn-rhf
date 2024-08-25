import { type InferSelectModel } from 'drizzle-orm';
import { type listSurveys } from '../data-layer/surveys';
import { type ExtractActionSucessData } from '../util/action-type-helpers';
import { type surveys } from './schema';

export type Survey = InferSelectModel<typeof surveys>;

export type ListSurveysDto = ExtractActionSucessData<typeof listSurveys>[number];
