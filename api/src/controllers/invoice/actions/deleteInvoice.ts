import { Request, Response } from "express";
import db from "../../../database";

export const deleteInvoice = async (
  req: Request<{ draft_id: string }>,
  res: Response
) => {
  if (!req.params.draft_id)
    return res.status(404).send({ detail: "No draft id found" });

  db.query(
    "DELETE FROM drafts WHERE id = $1",
    [req.params.draft_id],
    ({ rowCount }) =>
      rowCount > 0
        ? res.status(200).send({ detail: "draft deleted" })
        : res.status(404).send({ detail: "no draft found with that id" }),
    () => res.status(400).send({ detail: "there was an error" })
  );
};
