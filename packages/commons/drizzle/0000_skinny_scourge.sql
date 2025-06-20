CREATE SCHEMA IF NOT EXISTS "att";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type
    WHERE typname = 'motivation_termination_enum' AND typnamespace = 'att'::regnamespace
  ) THEN
    CREATE TYPE "att"."motivation_termination_enum" AS ENUM ('CESSAZIONE_UFFICIO', 'CESSAZIONE_VOLONTARIA');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type
    WHERE typname = 'status_processing_request_enum' AND typnamespace = 'att'::regnamespace
  ) THEN
    CREATE TYPE "att"."status_processing_request_enum" AS ENUM ('PRESA_IN_CARICO', 'IN_ELABORAZIONE', 'DISPONIBILE');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "att"."data_preparation" (
	"id_subject" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "att"."digital_addresses" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"subject_data_response_id" bigint NOT NULL,
	"address" varchar(255) NOT NULL,
	"profession" varchar(255),
	"usage_reason" "att"."motivation_termination_enum" NOT NULL,
	"usage_end_at" timestamp with time zone NOT NULL,
	CONSTRAINT "email_check" CHECK (address ~ '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9.-]+)+$')
);

CREATE TABLE IF NOT EXISTS "att"."list_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submitted_request_id" varchar(255) NOT NULL,
	"status" "att"."status_processing_request_enum" NOT NULL,
	"status_message" varchar(1024),
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "list_requests_submitted_request_id_unique" UNIQUE("submitted_request_id")
);

CREATE TABLE IF NOT EXISTS "att"."request_subjects" (
	"list_request_id" uuid NOT NULL,
	"subject_id" varchar(255) NOT NULL,
	CONSTRAINT "request_subjects_list_request_id_subject_id_pk" PRIMARY KEY("list_request_id","subject_id")
);

CREATE TABLE IF NOT EXISTS "att"."subject_data_responses" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"list_request_id" uuid NOT NULL,
	"subject_id" varchar(255) NOT NULL,
	"data_from" timestamp with time zone NOT NULL,
	CONSTRAINT "id_subject_check" CHECK (subject_id ~ '^([0-9]{11})|([A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1})$')
);

CREATE TABLE IF NOT EXISTS "att"."verification_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"result" boolean NOT NULL,
	"checked_at" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "att"."verification_requests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"json_request" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "att"."purposes" (
	"id" uuid PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "att"."birth_date" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_date" text,
	"no_day" text,
	"no_month" text,
	"place_of_birth_id" uuid
);

CREATE TABLE IF NOT EXISTS "att"."subject_binding" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relationship_type" text,
	"start_date" text,
	"relationship_code" text,
	"member_sequence" text,
	"start_date_relationship" text
);

CREATE TABLE IF NOT EXISTS "att"."criteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" text,
	"personal_id" text,
	"surname" text,
	"nosurname" text,
	"name" text,
	"noname" text,
	"gender" text,
	"birth_date_id" uuid
);

CREATE TABLE IF NOT EXISTS "att"."data_birth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exceptional_place" text,
	"municipality_id" uuid,
	"place_id" uuid
);

CREATE TABLE IF NOT EXISTS "att"."municipalities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_municipality" text,
	"istat_code" text,
	"acronym_istat_province" text,
	"place_description" text
);

CREATE TABLE IF NOT EXISTS "att"."places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_description" text,
	"country_description" text,
	"cod_state" text,
	"province_county" text
);

CREATE TABLE IF NOT EXISTS "att"."request_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_type" text,
	"requested_by" text,
	"created_at" text,
	"additional_info" json
);

CREATE TABLE IF NOT EXISTS "att"."requests_fs001" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"operation_id" text NOT NULL,
	"criteria_id" uuid NOT NULL,
	"request_data_id" uuid NOT NULL
);

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'digital_addresses' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'digital_addresses_subject_data_response_id_subject_data_responses_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."digital_addresses" ADD CONSTRAINT "digital_addresses_subject_data_response_id_subject_data_responses_id_fk" FOREIGN KEY ("subject_data_response_id") REFERENCES "att"."subject_data_responses"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'request_subjects' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'request_subjects_list_request_id_list_requests_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."request_subjects" ADD CONSTRAINT "request_subjects_list_request_id_list_requests_id_fk" FOREIGN KEY ("list_request_id") REFERENCES "att"."list_requests"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'subject_data_responses' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'subject_data_responses_list_request_id_list_requests_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."subject_data_responses" ADD CONSTRAINT "subject_data_responses_list_request_id_list_requests_id_fk" FOREIGN KEY ("list_request_id") REFERENCES "att"."list_requests"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'birth_date' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'birth_date_place_of_birth_id_places_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."birth_date" ADD CONSTRAINT "birth_date_place_of_birth_id_places_id_fk" FOREIGN KEY ("place_of_birth_id") REFERENCES "att"."places"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'criteria' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'criteria_birth_date_id_birth_date_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."criteria" ADD CONSTRAINT "criteria_birth_date_id_birth_date_id_fk" FOREIGN KEY ("birth_date_id") REFERENCES "att"."birth_date"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'data_birth' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'data_birth_municipality_id_municipalities_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."data_birth" ADD CONSTRAINT "data_birth_municipality_id_municipalities_id_fk" FOREIGN KEY ("municipality_id") REFERENCES "att"."municipalities"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'data_birth' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'data_birth_place_id_places_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."data_birth" ADD CONSTRAINT "data_birth_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "att"."places"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'requests_fs001' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'requests_fs001_criteria_id_criteria_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."requests_fs001" ADD CONSTRAINT "requests_fs001_criteria_id_criteria_id_fk" FOREIGN KEY ("criteria_id") REFERENCES "att"."criteria"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'requests_fs001' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'requests_fs001_request_data_id_request_data_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."requests_fs001" ADD CONSTRAINT "requests_fs001_request_data_id_request_data_id_fk" FOREIGN KEY ("request_data_id") REFERENCES "att"."request_data"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes WHERE indexname = 'da_sdr_response_id_idx'
  ) THEN
    CREATE INDEX "da_sdr_response_id_idx" ON "att"."digital_addresses" USING btree ("subject_data_response_id");
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes WHERE indexname = 'lr_submitted_req_id_idx_list_requests'
  ) THEN
    CREATE INDEX "lr_submitted_req_id_idx_list_requests" ON "att"."list_requests" USING btree ("submitted_request_id");
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes WHERE indexname = 'sdr_list_request_fk_idx_sdr'
  ) THEN
    CREATE INDEX "sdr_list_request_fk_idx_sdr" ON "att"."subject_data_responses" USING btree ("list_request_id");
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes WHERE indexname = 'sdr_subject_id_idx_sdr'
  ) THEN
    CREATE INDEX "sdr_subject_id_idx_sdr" ON "att"."subject_data_responses" USING btree ("subject_id");
  END IF;
END $$;
