import { Request, Response } from "express";
import db from "../../../database";

export const deleteItemFromInvoice = async (
  req: Request<{ item_id?: string }>,
  res: Response
) => {
  if (!req.params.item_id)
    return res.status(404).send({ detail: "There is no item_id in params" });

  db.query(
    `DELETE FROM items WHERE id = $1`,
    [req.params.item_id],
    (error, { rowCount }) =>
      error
        ? res.send(400)
        : rowCount > 0
        ? res.status(200).send("Deleted successfully")
        : res.status(404).send("Record not found")
  );
};
