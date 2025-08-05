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
    "latitude" text,
    "longitude" text,
    "foreign_cap" text,
    "foreign_place_description" text,
    "foreign_country_description" text,
    "foreign_country_state" text,
    "foreign_province_county" text,
    "foreign_toponym_denomination" text,
    "foreign_toponym_civic_number" text,
    "consulate_cod" text,
    "consulate_description" text,
    "subject_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "att"."subjects" (
    "uuid" uuid NOT NULL,
    "id" text NOT NULL,
    "subject_id" text PRIMARY KEY NOT NULL,
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
    "birth_province_county" text
);

CREATE TABLE IF NOT EXISTS "att"."fiscal_codes" (
    "id" serial PRIMARY KEY NOT NULL,
    "fiscal_code" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "fiscal_codes_fiscal_code_unique" UNIQUE("fiscal_code")
);

CREATE TABLE IF NOT EXISTS "att"."piva" (
    "organization_id" text PRIMARY KEY NOT NULL
);

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

CREATE TABLE IF NOT EXISTS "att"."handshakes" (
    "apikey" text PRIMARY KEY NOT NULL,
    "context_key" text NOT NULL
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
    WHERE table_name = 'addresses' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'addresses_subject_id_subjects_subject_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."addresses" ADD CONSTRAINT "addresses_subject_id_subjects_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "att"."subjects"("subject_id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'check' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'check_category_id_category_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."check" ADD CONSTRAINT "check_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "att"."category"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'trial' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'trial_check_id_check_id_fk' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."trial" ADD CONSTRAINT "trial_check_id_check_id_fk" FOREIGN KEY ("check_id") REFERENCES "att"."check"("id") ON DELETE no action ON UPDATE no action;
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

-- =============================================
-- INSERIMENTO DATI DI SEED
-- =============================================

INSERT INTO "att"."category" ("id", "code", "eservice", "description", "order") VALUES
(1, 'VOUCHER', 'residence-verification,fiscalcode-verification,piva-verification,digital-address-verification-verify,digital-address-verification-extract', 'bearer token', 1),
(2, 'Agid-JWT-Signature', 'residence-verification', 'token in Headers', 2),
(3, 'Agid-JWT-TrackingEvidence', 'residence-verification', 'token in Headers', 3),
(4, 'cert', 'fiscalcode-verification,piva-verification', 'Verify certificate validity', 2),
(5, 'e-service', 'residence-verification-001', 'e-service exposed by the application', 4),
(6, 'e-service', 'fiscalcode-verification', 'e-service exposed by the application', 3),
(7, 'e-service', 'piva-verification', 'e-service exposed by the application', 3),
(8, 'e-service', 'digital-address-verification-verify', 'e-service exposed by the application', 2),
(9, 'e-service', 'digital-address-verification-extract', 'e-service exposed by the application', 2),
(10, 'e-service', 'digital-address-verification-list', 'e-service exposed by the application', 2),
(11, 'e-service', 'digital-address-verification-list-state', 'e-service exposed by the application', 2),
(12, 'e-service', 'digital-address-verification-list-response', 'e-service exposed by the application', 2),
(13, 'e-service', 'residence-verification-002', 'e-service exposed by the application', 4),
(14, 'e-service', 'family-status', 'API per la consultazione dello stato di famiglia', 5),
(16, 'e-service', 'residence-submission-001', 'API per l invio di una residenza', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "att"."check" ("id", "code", "description", "order", "category_id") VALUES
(1, 'authData', 'Bearer token can not be parsed', 1, 1),
(2, 'header', 'not present', 2, 1),
(3, 'payload', 'not present', 3, 1),
(4, 'typ', '"typ" not valid in Authentication Bearer', 4, 1),
(5, 'iss', '"iss" not valid in Authentication Bearer header', 5, 1),
(6, 'aud', '"aud" not valid in Authentication Bearer header', 6, 1),
(7, 'agid-jwt-signature', 'header attribute not present', 1, 2),
(8, 'agid-jwt-signature', 'header attribute not valid', 2, 2),
(9, 'publicKeyService', 'token not valid', 3, 2),
(10, 'payload', 'not present', 4, 2),
(11, 'exp', '"exp" is required in agid-jwt-signature payload token', 5, 2),
(12, 'exp', '"exp" is expired in agid-jwt-signature payload token', 6, 2),
(13, 'iat', '"iat" is required in agid-jwt-signature payload token', 7, 2),
(14, 'iat', '"iat" is expired in agid-jwt-signature payload token', 8, 2),
(15, 'aud', '"aud" is required in agid-jwt-signature payload token', 9, 2),
(16, 'aud', '"aud" is not valid in agid-jwt-signature payload token', 10, 2),
(17, 'content-type', '"content-type" is required in agid-jwt-signature payload token', 11, 2),
(18, 'content-encoding', '"content-encoding" is required in agid-jwt-signature payload token', 12, 2),
(19, 'signed-headers', '"signed-headers" is required in agid-jwt-signature payload token', 13, 2),
(20, 'signed-headers_content-type', '"content-type" in "signed-headers" is required in agid-jwt-signature payload token', 14, 2),
(21, 'signed-headers_content-encoding', '"content-encoding" in "signed-headers" is required in agid-jwt-signature payload token', 15, 2),
(22, 'signed-headers_digest', '"digest" in "signed-headers" is required in agid-jwt-signature payload token', 16, 2),
(23, 'signed-headers_content-type', '"content-type" in "signed-headers" not match with "content-type" in headers', 17, 2),
(24, 'signed-headers_content-encoding', '"content-encoding" in "signed-headers" not match with "content-encoding" in headers', 18, 2),
(25, 'signed-headers_digest', '"digest" in "signed-headers" not start with "SHA-256="', 19, 2),
(26, 'digest', '"digest" in headers not start with "SHA-256="', 20, 2),
(27, 'signed-headers_digest', '"digest" in "signed-headers" not match with "digest" in headers', 21, 2),
(28, 'digest', 'hashed request body not match with the "digest" in the "signed-headers"', 22, 2),
(29, 'agid-jwt-trackingevidence', 'header attribute not present', 1, 3),
(30, 'agid-jwt-trackingevidence', 'header attribute not valid', 2, 3),
(31, 'publicKeyService', 'token not valid', 3, 3),
(32, 'payload', 'not present', 4, 3),
(33, 'exp', '"exp "is required in agid-jwt-trackingevidence payload token', 5, 3),
(34, 'exp', '"exp" is expired in agid-jwt-trackingevidence payload token', 6, 3),
(35, 'iat', '"iat" is required in agid-jwt-trackingevidence payload token', 7, 3),
(36, 'iat', '"iat" is expired in agid-jwt-trackingevidence payload token', 8, 3),
(37, 'aud', '"aud" is required in agid-jwt-trackingevidence payload token', 9, 3),
(38, 'aud', '"aud" is not valid in agid-jwt-trackingevidence payload token', 10, 3),
(39, 'iss', '"iss" is required in agid-jwt-trackingevidence payload token', 11, 3),
(40, 'purposeId', '"purposeId" not valid in agid-jwt-trackingevidence payload token', 12, 3),
(41, 'userID', '"userID" not valid in agid-jwt-trackingevidence payload token', 13, 3),
(42, 'userLocation', '"userLocation" not valid in agid-jwt-trackingevidence payload token', 14, 3),
(43, 'LoA', '"LoA" not valid in agid-jwt-trackingevidence payload token', 15, 3),
(44, 'VOUCHER', 'Authorization bearer token', 7, 1),
(45, 'Agid-JWT-Signature', 'Token in the request Headers', 23, 2),
(46, 'Agid-JWT-TrackingEvidence', 'Token in the request Headers', 18, 3),
(47, 'residence-verification-001', 'API for a consultation of a residence', 4, 5),
(48, 'fiscalcode-verification', 'API to validate a specific fiscal code', 3, 6),
(49, 'cert', 'OK', 2, 4),
(50, 'cert', 'Not Valid', 2, 4),
(51, 'piva-verification', 'API to validate a specific vat code', 3, 7),
(52, 'digital-address-verification-verify', 'API to validate a specific digital address associated with a fiscal code', 2, 8),
(53, 'digital-address-verification-extract', 'API to validate a specific digital address associated with a fiscal code', 2, 9),
(54, 'digital-address-verification-list', 'API thath allows you to enter a request for the extraction of digital address', 2, 10),
(55, 'digital-address-verification-list-state', 'API that allows you to check the processing status of the request for the list of digital address', 2, 11),
(56, 'digital-address-verification-list-response', 'API that allows you to retrieve the list of digital address', 2, 12),
(57, 'residence-verification-002', 'API to verify a residence', 4, 13),
(58, 'family-status', 'API for a consultation of a family status', 1, 14),
(59, 'VOUCHER_DIGEST_NOT_VALID', 'Voucher digest is not valid', 8, 1),
(60, 'residence-submission-001', 'API for a submission of a residence', 1, 16),
(61, 'SIGNATURE_HEADER_NOT_PRESENT', '"content-type" or "content-encoding" are missing', 24, 2),
(62, 'SIGNATURE_EXP_INVALID', '"exp" claim is missing or token has expired', 25, 2)
ON CONFLICT (id) DO NOTHING;