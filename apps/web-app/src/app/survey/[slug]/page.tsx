import { eq, sql } from "drizzle-orm";
import { InsightSummaryTable } from "~/components/modules/insights-summary-table";
import { db } from "~/server/db";
import { insights, surveys } from "~/server/db/schema";
import { type InsightSummary } from "~/server/db/types";

// Extract the sentiment values from the schema
const sentimentValues = insights.sentiment.enumValues;

export default async function Home({ params }: { params: { slug: string } }) {
  const insightsSummary = (await db
    .select({
      topic: insights.topic,
      ...Object.fromEntries(
        sentimentValues.map((sentiment) => [
          sentiment,
          sql<number>`cast(sum(case when ${insights.sentiment} = ${sentiment} then 1 else 0 end) as integer)`.as(
            sentiment,
          ),
        ]),
      ),
      total: sql<number>`cast(count(*) as integer)`.as("total"),
    })
    .from(surveys)
    .leftJoin(insights, eq(insights.surveyId, surveys.id))
    .where(eq(surveys.slug, params.slug))
    .groupBy(
      surveys.id,
      surveys.name,
      surveys.status,
      insights.topic,
    )) as InsightSummary[];

  return <InsightSummaryTable insightsSummary={insightsSummary} />;
}
