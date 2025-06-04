CREATE SCHEMA IF NOT EXISTS "att";

CREATE TABLE IF NOT EXISTS "att"."category" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"eservice" varchar(255) NOT NULL,
	"description" varchar(255),
	"order" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "att"."check" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"description" varchar(255),
	"order" integer NOT NULL,
	"category_id" bigserial NOT NULL
);

CREATE TABLE IF NOT EXISTS "att"."trial" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"purpose_id" varchar(255) NOT NULL,
	"correlation_id" varchar(255) NOT NULL,
	"operation_path" varchar(255) NOT NULL,
	"operation_method" varchar(255),
	"check_id" bigint,
	"response" varchar(255),
	"created_date" timestamp,
	"message" varchar(255)
);

DO $$ BEGIN
	ALTER TABLE "att"."check" ADD CONSTRAINT "check_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "att"."category"("id") ON DELETE no action ON UPDATE no action;
	ALTER TABLE "att"."trial" ADD CONSTRAINT "trial_check_id_check_id_fk" FOREIGN KEY ("check_id") REFERENCES "att"."check"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 	WHEN duplicate_object THEN null;
END;
$$;
