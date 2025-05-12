CREATE SCHEMA IF NOT EXISTS att;

-- Creazione della tabella subjects
CREATE TABLE IF NOT EXISTS att.subjects (
  uuid UUID PRIMARY KEY,
  id TEXT,
  subject_id TEXT,
  surname TEXT,
  name TEXT,
  gender TEXT,
  birth_event_date TEXT,
  birth_exceptional_place TEXT,
  birth_municipality_name TEXT,
  birth_municipality_istat_code TEXT,
  birth_municipality_acronym_istat_province TEXT,
  birth_municipality_place_description TEXT,
  birth_place_description TEXT,
  birth_country_description TEXT,
  birth_cod_state TEXT,
  birth_province_county TEXT
);

-- Creazione della tabella addresses
CREATE TABLE IF NOT EXISTS att.addresses (
  id UUID PRIMARY KEY,
  address_type TEXT,
  note_address TEXT,
  address_start_date TEXT,
  presso TEXT,
  address_municipality_name TEXT,
  address_municipality_istat_code TEXT,
  address_municipality_acronym_istat_province TEXT,
  address_municipality_place_description TEXT,
  toponym_cod_type TEXT,
  toponym_type TEXT,
  toponym_origin_type TEXT,
  toponym_cod TEXT,
  toponym_denomination TEXT,
  toponym_source TEXT,
  civic_cod TEXT,
  civic_source TEXT,
  civic_number TEXT,
  metric TEXT,
  prog_snc TEXT,
  letter TEXT,
  exponent1 TEXT,
  color TEXT,
  internal_court TEXT,
  internal_stairs TEXT,
  internal1 TEXT,
  esp_internal1 TEXT,
  internal2 TEXT,
  esp_internal2 TEXT,
  external_stairs TEXT,
  secondary TEXT,
  floor TEXT,
  nui TEXT,
  isolated TEXT,
  latitude TEXT,
  longitude TEXT,
  foreign_cap TEXT,
  foreign_place_description TEXT,
  foreign_country_description TEXT,
  foreign_country_state TEXT,
  foreign_province_county TEXT,
  foreign_toponym_denomination TEXT,
  foreign_toponym_civic_number TEXT,
  consulate_cod TEXT,
  consulate_description TEXT
);
-- Creazione della tabella purposes
CREATE TABLE IF NOT EXISTS att.purposes (
  id UUID PRIMARY KEY
);

-- Creazione della tabella users
CREATE TABLE IF NOT EXISTS att.usecases (
  id UUID PRIMARY KEY,
  purpose_id UUID REFERENCES att.purposes(id),
  subject_id UUID REFERENCES att.subjects(uuid),
  address_id UUID REFERENCES att.addresses(id)
);
