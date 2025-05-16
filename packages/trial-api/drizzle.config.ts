import { Config, defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    schema: './dist/db/schema/*.js',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: Number(process.env.DATABASE_PORT ?? '5432'),
        user: process.env.DATABASE_USERNAME ?? '',
        password: process.env.DATABASE_PASSWORD ?? '',
        database: process.env.DATABASE_NAME ?? '',
        ssl: process.env.DATABASE_SSL == "true",
    },
}) satisfies Config;

