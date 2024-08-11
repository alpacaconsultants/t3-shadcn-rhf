CREATE TABLE IF NOT EXISTS "strixy_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strixy_survey" ADD CONSTRAINT "strixy_survey_created_by_strixy_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."strixy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "survey_created_by_idx" ON "strixy_survey" ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "survey_name_idx" ON "strixy_survey" ("name");