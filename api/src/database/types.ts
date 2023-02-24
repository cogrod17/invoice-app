type OnSuccessHandler = (result: QueryResult) => void;
import { QueryResult } from "pg";

export type OnErrorHandler = (error: Error) => void;

export type QueryFn = (
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
