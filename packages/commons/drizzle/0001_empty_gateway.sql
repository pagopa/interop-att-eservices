CREATE TABLE "att"."data_preparation" (
	"id_subject" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "att"."verification_requests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"json_request" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "att"."list_requests" DROP CONSTRAINT "list_requests_purpose_id_purposes_id_fk";
--> statement-breakpoint
DROP INDEX "att"."lr_purpose_id_idx";--> statement-breakpoint
ALTER TABLE "att"."list_requests" DROP COLUMN "purpose_id";