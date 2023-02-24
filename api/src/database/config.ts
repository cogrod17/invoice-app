import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const connectionString =
  environment === "test" ? process.env.DB_TEST_URL : process.env.DB_URL;

export const pool = new Pool({
  max: 20,
  connectionString,
  idleTimeoutMillis: 30000,
});

export const db = pool;
