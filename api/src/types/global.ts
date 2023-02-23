import { Request, Response } from "express";

export interface TypedReqBody<T> extends Request {
  body: T;
}

export type DBQuery = (req: Request, res: Response) => void;

export type QueryParams = boolean | string | number | null;
