CREATE TABLE IF NOT EXISTS "att"."signal_counters" (
	"eservice_id" text PRIMARY KEY NOT NULL,
	"signal_id" bigint DEFAULT 0 NOT NULL
);

INSERT INTO "att"."check" ("id", "code", "description", "order", "category_id") VALUES
(63, 'PSEUDONYMIZATION_001', 'Pseudonymization service', 5, 5)
ON CONFLICT (id) DO NOTHING;