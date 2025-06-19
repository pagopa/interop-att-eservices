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
