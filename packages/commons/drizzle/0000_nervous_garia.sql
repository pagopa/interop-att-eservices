CREATE SCHEMA IF NOT EXISTS att;
--> statement-breakpoint
CREATE TYPE att.motivation_termination_enum AS ENUM('CESSAZIONE_UFFICIO', 'CESSAZIONE_VOLONTARIA');
--> statement-breakpoint
CREATE TYPE att.status_processing_request_enum AS ENUM('PRESA_IN_CARICO', 'IN_ELABORAZIONE', 'DISPONIBILE');
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS att.digital_addresses (
    "id" bigserial PRIMARY KEY NOT NULL,
    "subject_data_response_id" bigint NOT NULL,
    "address" varchar(255) NOT NULL,
    "profession" varchar(255),
    "usage_reason" att.motivation_termination_enum NOT NULL,
    "usage_end_date" timestamp with time zone NOT NULL,
    CONSTRAINT "email_check" CHECK (address ~ '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS att.list_requests (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "submitted_request_id" varchar(255) NOT NULL,
    "status" att.status_processing_request_enum NOT NULL,
    "status_message" varchar(1024),
    "created_at_timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT "list_requests_submitted_request_id_unique" UNIQUE("submitted_request_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS att.request_subjects (
    "list_request_id" uuid NOT NULL,
    "subject_id" varchar(255) NOT NULL,
    CONSTRAINT "request_subjects_list_request_id_subject_id_pk" PRIMARY KEY("list_request_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS att.subject_data_responses (
    "id" bigserial PRIMARY KEY NOT NULL,
    "list_request_id" uuid NOT NULL,
    "id_subject" varchar(255) NOT NULL,
    "data_from_timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT "id_subject_check" CHECK (id_subject ~ '^([0-9]{11})|([A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1})$')
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS att.verification_logs (
    "id" bigserial PRIMARY KEY NOT NULL,
    "result" boolean NOT NULL,
    "timestamp_check" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS att.purposes (
    "id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE att.digital_addresses ADD CONSTRAINT "digital_addresses_subject_data_response_id_subject_data_responses_id_fk" FOREIGN KEY ("subject_data_response_id") REFERENCES att.subject_data_responses("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE att.request_subjects ADD CONSTRAINT "request_subjects_list_request_id_list_requests_id_fk" FOREIGN KEY ("list_request_id") REFERENCES att.list_requests("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE att.subject_data_responses ADD CONSTRAINT "subject_data_responses_list_request_id_list_requests_id_fk" FOREIGN KEY ("list_request_id") REFERENCES att.list_requests("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "da_sdr_fk_idx" ON att.digital_addresses USING btree ("subject_data_response_id");
--> statement-breakpoint
CREATE INDEX "lr_submitted_req_id_idx" ON att.list_requests USING btree ("submitted_request_id");
--> statement-breakpoint
CREATE INDEX "sdr_list_request_fk_idx" ON att.subject_data_responses USING btree ("list_request_id");
--> statement-breakpoint
CREATE INDEX "sdr_id_subject_idx" ON att.subject_data_responses USING btree ("id_subject");