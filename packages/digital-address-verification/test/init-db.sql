-- packages/digital-address-verification/test/init-db.sql

-- Crea lo schema se non esiste
CREATE SCHEMA IF NOT EXISTS att;

-- Crea gli ENUM se non esistono (da schemi pdnd-common)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motivation_termination_enum') THEN
        CREATE TYPE att.motivation_termination_enum AS ENUM ('CESSAZIONE_UFFICIO', 'CESSAZIONE_VOLONTARIA');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_processing_request_enum') THEN
        CREATE TYPE att.status_processing_request_enum AS ENUM ('PRESA_IN_CARICO', 'IN_ELABORAZIONE', 'DISPONIBILE');
    END IF;
END $$;

-- IMPORTANTE: DROP TABLE CASCADE per pulire l'ambiente di test.
-- L'ordine dei DROP è cruciale per via delle chiavi esterne (dalle figlie alle madri).
DROP TABLE IF EXISTS att.digital_addresses CASCADE;
DROP TABLE IF EXISTS att.request_subjects CASCADE;
DROP TABLE IF EXISTS att.subject_data_responses CASCADE;
DROP TABLE IF EXISTS att.list_requests CASCADE;
DROP TABLE IF EXISTS att.verification_requests CASCADE;
DROP TABLE IF EXISTS att.verification_logs CASCADE;


-- Definizione delle tabelle Drizzle basate ESCLUSIVAMENTE sugli schemi forniti (pdnd-common)

-- Tabella: list_requests
CREATE TABLE IF NOT EXISTS att.list_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitted_request_id VARCHAR(255) UNIQUE NOT NULL,
    status att.status_processing_request_enum NOT NULL,
    status_message VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS lr_submitted_req_id_idx_list_requests ON att.list_requests (submitted_request_id);

-- Tabella: subject_data_responses
CREATE TABLE IF NOT EXISTS att.subject_data_responses (
    id BIGSERIAL PRIMARY KEY,
    list_request_id UUID NOT NULL REFERENCES att.list_requests(id) ON DELETE CASCADE,
    subject_id VARCHAR(255) NOT NULL,
    data_from TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT id_subject_check CHECK (subject_id ~ '^([0-9]{11})|([A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1})$'),
    CONSTRAINT unique_sdr_list_req_subject UNIQUE (list_request_id, subject_id)
);
CREATE INDEX IF NOT EXISTS sdr_list_request_fk_idx_sdr ON att.subject_data_responses (list_request_id);
CREATE INDEX IF NOT EXISTS sdr_subject_id_idx_sdr ON att.subject_data_responses (subject_id);

-- Tabella: digital_addresses
CREATE TABLE IF NOT EXISTS att.digital_addresses (
    id BIGSERIAL PRIMARY KEY,
    subject_data_response_id BIGINT NOT NULL REFERENCES att.subject_data_responses(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    profession VARCHAR(255),
    usage_reason att.motivation_termination_enum NOT NULL,
    usage_end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT email_check CHECK (address ~ '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9.-]+)+$')
);
CREATE INDEX IF NOT EXISTS da_sdr_response_id_idx ON att.digital_addresses (subject_data_response_id);

-- Tabella: request_subjects
CREATE TABLE IF NOT EXISTS att.request_subjects (
    list_request_id UUID NOT NULL REFERENCES att.list_requests(id) ON DELETE CASCADE,
    subject_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (list_request_id, subject_id)
);

-- Tabella: verification_requests
CREATE TABLE IF NOT EXISTS att.verification_requests (
    id UUID PRIMARY KEY,
    count INTEGER NOT NULL,
    json_request JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabella: verification_logs
CREATE TABLE IF NOT EXISTS att.verification_logs (
    id BIGSERIAL PRIMARY KEY,
    result BOOLEAN NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL
);