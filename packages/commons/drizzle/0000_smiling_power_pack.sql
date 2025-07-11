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
	CONSTRAINT "unique_sdr_list_req_subject" UNIQUE("list_request_id","subject_id"),
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

CREATE TABLE IF NOT EXISTS "att"."family_status" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id" varchar(64) NOT NULL,
	"subjectId" varchar(16) NOT NULL,
	"surname" text NOT NULL,
	"name" text NOT NULL,
	"gender" varchar(1),
	"birthDate" date,
	"municipality_nameMunicipality" text,
	"municipality_istatCode" text,
	"municipality_acronymIstatProvince" text,
	"municipality_placeDescription" text,
	"place_placeDescription" text,
	"place_countryDescription" text,
	"place_codState" text,
	"place_provinceCounty" text,
	"relationshipType" text,
	"startDate" date,
	"relationshipCode" text,
	"memberSequence" text,
	"startDateRelationship" date,
	"endDateRelationship" date,
	CONSTRAINT "family_status_subjectId_unique" UNIQUE("subjectId")
);

CREATE TABLE IF NOT EXISTS "att"."addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address_type" text,
	"note_address" text,
	"address_start_date" text,
	"presso" text,
	"address_municipality_name" text,
	"address_municipality_istat_code" text,
	"address_municipality_acronym_istat_province" text,
	"address_municipality_place_description" text,
	"toponym_cod_type" text,
	"toponym_type" text,
	"toponym_origin_type" text,
	"toponym_cod" text,
	"toponym_denomination" text,
	"toponym_source" text,
	"civic_cod" text,
	"civic_source" text,
	"civic_number" text,
	"metric" text,
	"prog_snc" text,
	"letter" text,
	"exponent1" text,
	"color" text,
	"internal_court" text,
	"internal_stairs" text,
	"internal1" text,
	"esp_internal1" text,
	"internal2" text,
	"esp_internal2" text,
	"external_stairs" text,
	"secondary" text,
	"floor" text,
	"nui" text,
	"isolated" text,
	"foreign_cap" text,
	"foreign_place_description" text,
	"foreign_country_description" text,
	"foreign_country_state" text,
	"foreign_province_county" text,
	"foreign_toponym_denomination" text,
	"foreign_toponym_civic_number" text,
	"consulate_cod" text,
	"consulate_description" text
);

CREATE TABLE IF NOT EXISTS "att"."subjects" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"id" text NOT NULL,
	"subject_id" text NOT NULL,
	"surname" text,
	"name" text,
	"gender" text,
	"birth_event_date" text,
	"birth_exceptional_place" text,
	"birth_municipality_name" text,
	"birth_municipality_istat_code" text,
	"birth_municipality_acronym_istat_province" text,
	"birth_municipality_place_description" text,
	"birth_place_description" text,
	"birth_country_description" text,
	"birth_cod_state" text,
	"birth_province_county" text,
	"address_id" uuid NOT NULL
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
    WHERE table_name = 'subjects' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'subjects_address_id_addresses_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."subjects" ADD CONSTRAINT "subjects_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "att"."addresses"("id") ON DELETE no action ON UPDATE no action;
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
