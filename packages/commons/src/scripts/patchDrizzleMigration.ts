/* eslint-disable functional/no-let */
/* eslint-disable no-console */
import fs from "fs";
import path from "path";
const MIGRATIONS_DIR = "./drizzle";
const SEED_DATA_FILE = "./src/scripts/seed-data.sql";

function patchLatestMigration(): void {
  const files = [...fs.readdirSync(MIGRATIONS_DIR)]
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => b.localeCompare(a));

  if (files.length === 0) {
    throw new Error("No migration files found.");
  }

  const latestFile = path.join(MIGRATIONS_DIR, files[0]);
  const rawContent = fs.readFileSync(latestFile, "utf-8");

  const withSchemaFixed = rawContent.replace(
    /CREATE SCHEMA (?!IF NOT EXISTS)/g,
    "CREATE SCHEMA IF NOT EXISTS "
  );

  const withCreateFixed = withSchemaFixed.replace(
    /CREATE TABLE (?!IF NOT EXISTS)/g,
    "CREATE TABLE IF NOT EXISTS "
  );

  const withDropFixed = withCreateFixed.replace(
    /DROP TABLE (?!IF EXISTS)/g,
    "DROP TABLE IF EXISTS "
  );

  const addColumnRegex =
    /ALTER TABLE\s+("[^"]+"\.)?"?([a-zA-Z0-9_]+)"?\s+ADD COLUMN\s+([^;]+);/g;
  const addColumnMatches = [...withDropFixed.matchAll(addColumnRegex)];

  const withAddColumnWrapped = addColumnMatches.reduce((acc, match) => {
    const schema = match[1] ?? "";
    const table = match[2];
    const columnDef = match[3];
    const fullTable = `${schema}"${table}"`;
    const block = `
DO $$$$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = '${table}'${
      schema
        ? ` AND table_schema = '${schema.replace(/"/g, "").replace(".", "")}'`
        : ""
    }
  ) THEN
    ALTER TABLE ${fullTable} ADD COLUMN ${columnDef};
  END IF;
END $$$$;
`;

    return acc.replace(match[0], block);
  }, withDropFixed);

  const addConstraintRegex =
    /ALTER TABLE\s+("[^"]+"\.)?"?([a-zA-Z0-9_]+)"?\s+ADD CONSTRAINT\s+([^;]+);/g;
  const addConstraintMatches = [
    ...withAddColumnWrapped.matchAll(addConstraintRegex),
  ];

  const withAddConstraintWrapped = addConstraintMatches.reduce((acc, match) => {
    const schema = match[1] ?? "";
    const table = match[2];
    const constraintDef = match[3];
    const fullTable = `${schema}"${table}"`;
    const schemaName = schema.replace(/[".]/g, "");

    const constraintNameMatch = constraintDef.trim().match(/^"([^"]+)"/);
    if (!constraintNameMatch) {
      return acc;
    }
    const constraintName = constraintNameMatch[1];

    const block = `
DO $$$$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = '${table}'${
      schema ? ` AND table_schema = '${schemaName}'` : ""
    }
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = '${constraintName}'${
      schema ? ` AND table_schema = '${schemaName}'` : ""
    }
  ) THEN
    ALTER TABLE ${fullTable} ADD CONSTRAINT ${constraintDef};
  END IF;
END $$$$;
`;

    return acc.replace(match[0], block);
  }, withAddColumnWrapped);

  const createIndexRegex =
    /CREATE INDEX\s+"([^"]+)"\s+ON\s+("[^"]+"\.)?"?([a-zA-Z0-9_]+)"?\s+USING\s+btree\s*\([^)]+\);/g;
  const createIndexMatches = [
    ...withAddConstraintWrapped.matchAll(createIndexRegex),
  ];

  const withCreateIndexWrapped = createIndexMatches.reduce((acc, match) => {
    const indexName = match[1];
    const createStmt = match[0];
    const block = `
DO $$$$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes WHERE indexname = '${indexName}'
  ) THEN
    ${createStmt}
  END IF;
END $$$$;
`;

    return acc.replace(createStmt, block);
  }, withAddConstraintWrapped);

  const createTypeRegex =
    /CREATE TYPE\s+("[^"]+"\.)?"?([a-zA-Z0-9_]+)"?\s+AS ENUM\s*\(([^;]+)\);/g;
  const createTypeMatches = [
    ...withCreateIndexWrapped.matchAll(createTypeRegex),
  ];

  const withCreateTypeWrapped = createTypeMatches.reduce((acc, match) => {
    const schema = match[1] ?? "";
    const typeName = match[2];
    const enumValues = match[3];
    const fullType = `${schema}"${typeName}"`;
    const schemaName = schema.replace(/[".]/g, "");

    const block = `
DO $$$$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type
    WHERE typname = '${typeName}'${
      schema ? ` AND typnamespace = '${schemaName}'::regnamespace` : ""
    }
  ) THEN
    CREATE TYPE ${fullType} AS ENUM (${enumValues});
  END IF;
END $$$$;
`;

    return acc.replace(match[0], block);
  }, withCreateIndexWrapped);

  const finalContent = withCreateTypeWrapped.replace(
    /^\s*-->\s*statement-breakpoint\s*$/gm,
    ""
  );

  let seedContent = "";
  if (fs.existsSync(SEED_DATA_FILE)) {
    seedContent = fs.readFileSync(SEED_DATA_FILE, "utf-8");
    console.log(`✅ Contenuto letto da: ${SEED_DATA_FILE}`);
  } else {
    console.log(
      `⚠️  Attenzione: file di seed non trovato a '${SEED_DATA_FILE}'. Verrà saltato.`
    );
  }

  const contentToWrite = finalContent + seedContent;

  fs.writeFileSync(latestFile, contentToWrite);
  console.log(
    `✅ File di migrazione patchato. Dati di seed aggiunti a: ${latestFile}`
  );
}

patchLatestMigration();
