import { Response } from "express";
import db from "../../../database";
import { TypedReqBody, Item } from "../../../types";
import format from "pg-format";

export const addItemsToInvoice = async (
  req: TypedReqBody<Item[]>,
  res: Response
) => {
  const items = req.body;
  const draft_id = req.params.draft_id;

  const values = items.map(({ title, unit_cost, quantity }) => [
    +draft_id,
    title,
    unit_cost,
    quantity,
  ]);

  const text = format(
    "INSERT INTO items (draft_id, title, unit_cost, quantity) VALUES %L RETURNING *",
    values
  );

  db.query(text, [], (error, result) =>
    error ? res.status(500).send(error) : res.status(200).send(result.rows)
  );
};
