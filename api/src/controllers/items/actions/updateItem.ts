import { Response, Request } from "express";
import db from "../../../database";
import { Item } from "../../../types";
import { matchValuesForQuery } from "../../../utils/matchValuesForQuery";

type UpdateFn = (
  req: Request<{ item_id: string }, Item>,
  res: Response
) => Promise<Response | void>;

export const updateItem: UpdateFn = async (req, res) => {
  if (!req.params.item_id) return res.status(404).send();

  const [columns, placeholders, params] = matchValuesForQuery(req.body);
  const mapColumnsToPlace = columns.reduce(
    (acc, col, i) => (acc += `${i < 1 ? "" : ","} ${col} = ${placeholders[i]}`),
    ""
  );

  try {
    const { rows, rowCount } = await db.asyncQuery(
      `UPDATE items SET ${mapColumnsToPlace} WHERE id = $${
        placeholders.length + 1
      } RETURNING *`,
      [...params, req.params.item_id]
    );

    if (!rowCount)
      return res.status(404).send({ detail: "could not find item record" });

    return res.status(200).send(rows[0]);
  } catch (e) {
    return res.status(500).send(e);
  }
};
