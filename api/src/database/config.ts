import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  max: 20,
  connectionString: process.env.DB_URL,
  idleTimeoutMillis: 30000,
});

type OnSuccessHandler = (result: QueryResult) => void;
type OnErrorHandler = (error: Error) => void;

type QueryFn = (
  text: string,
  params: any[], //eslint-disable-line
  onSuccess: OnSuccessHandler,
  onError: OnErrorHandler
) => void;

export interface DB {
  connect: () => void;
  query: QueryFn;
  asyncQuery: (
    text: string,
    params: any[] //eslint-disable-line
  ) => Promise<QueryResult>;
}

export const db: DB = {
  connect: () =>
    pool.connect((err: Error) => {
      if (err) throw new Error();
      else console.log("database connected");
    }),
  query: async (text, params, onSuccess, onError) =>
    pool.query(text, params, (error, result) =>
      error ? onError(error) : onSuccess(result)
    ),
  asyncQuery: async (text, params) => await pool.query(text, params),
};
