CREATE SCHEMA "att";
--> statement-breakpoint
CREATE TABLE "att"."category" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"eservice" varchar(255) NOT NULL,
	"description" varchar(255),
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "att"."check" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"description" varchar(255),
	"order" integer NOT NULL,
	"category_id: " bigserial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "att"."trial" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"purpose_id" varchar(255) NOT NULL,
	"correlation_id" varchar(255) NOT NULL,
	"operation_path" varchar(255) NOT NULL,
	"operation_method" varchar(255),
	"check_id: " bigint,
	"response" varchar(255),
	"created_date" timestamp,
	"message" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "att"."check" ADD CONSTRAINT "check_category_id: _category_id_fk" FOREIGN KEY ("category_id: ") REFERENCES "att"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "att"."trial" ADD CONSTRAINT "trial_check_id: _check_id_fk" FOREIGN KEY ("check_id: ") REFERENCES "att"."check"("id") ON DELETE no action ON UPDATE no action;