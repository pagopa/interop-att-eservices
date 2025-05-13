import { pgSchema, uuid, text } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
const att = pgSchema("att");

export const Address = att.table("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),

  address_type: text("address_type"),
  note_address: text("note_address"),
  address_start_date: text("address_start_date"),
  presso: text("presso"),
  address_municipality_name: text("address_municipality_name"),
  address_municipality_istat_code: text("address_municipality_istat_code"),
  address_municipality_acronym_istat_province: text(
    "address_municipality_acronym_istat_province"
  ),
  address_municipality_place_description: text(
    "address_municipality_place_description"
  ),

  toponym_cod_type: text("toponym_cod_type"),
  toponym_type: text("toponym_type"),
  toponym_origin_type: text("toponym_origin_type"),
  toponym_cod: text("toponym_cod"),
  toponym_denomination: text("toponym_denomination"),
  toponym_source: text("toponym_source"),

  civic_cod: text("civic_cod"),
  civic_source: text("civic_source"),
  civic_number: text("civic_number"),
  metric: text("metric"),
  prog_snc: text("prog_snc"),
  letter: text("letter"),
  exponent1: text("exponent1"),
  color: text("color"),

  internal_court: text("internal_court"),
  internal_stairs: text("internal_stairs"),
  internal1: text("internal1"),
  esp_internal1: text("esp_internal1"),
  internal2: text("internal2"),
  esp_internal2: text("esp_internal2"),
  external_stairs: text("external_stairs"),
  secondary: text("secondary"),
  floor: text("floor"),
  nui: text("nui"),
  isolated: text("isolated"),

  latitude: text("latitude"),
  longitude: text("longitude"),

  foreign_cap: text("foreign_cap"),
  foreign_place_description: text("foreign_place_description"),
  foreign_country_description: text("foreign_country_description"),
  foreign_country_state: text("foreign_country_state"),
  foreign_province_county: text("foreign_province_county"),
  foreign_toponym_denomination: text("foreign_toponym_denomination"),
  foreign_toponym_civic_number: text("foreign_toponym_civic_number"),

  consulate_cod: text("consulate_cod"),
  consulate_description: text("consulate_description"),
});

// TODO; da modificare per la gestione del salvataggio dati
export type Address = InferSelectModel<typeof Address>;
