CREATE TABLE IF NOT EXISTS "strixy_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "strixy_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strixy_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strixy_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strixy_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strixy_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "strixy_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strixy_account" ADD CONSTRAINT "strixy_account_user_id_strixy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."strixy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strixy_post" ADD CONSTRAINT "strixy_post_created_by_strixy_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."strixy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strixy_session" ADD CONSTRAINT "strixy_session_user_id_strixy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."strixy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "strixy_account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "strixy_post" ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "strixy_post" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "strixy_session" ("user_id");