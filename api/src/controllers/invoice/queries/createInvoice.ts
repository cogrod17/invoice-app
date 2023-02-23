import { matchValuesForQuery } from "../../../utils/matchValuesForQuery";
import { Recipient } from "../../../types";

type Params = string | number | boolean | null; //eslint-disable-line

type GenInvoice = (recipient: Recipient, user_id: number) => [string, Params[]];

export const createInvoiceQuery: GenInvoice = (recipient, user_id) => {
  const [columns, placeholders, params] = matchValuesForQuery({
    ...recipient,
    user_id,
  });

  const mapColumnsToPlace = columns.reduce(
    (acc, col, i) => (acc += `${i < 1 ? "" : ","} ${col} = ${placeholders[i]}`),
    ""
  );

  return [
    `WITH new_recipient AS (
          INSERT INTO recipients(${columns.join(", ")}) 
          VALUES (${placeholders.join(", ")})
	        ON CONFLICT (email, user_id) DO UPDATE
	        SET ${mapColumnsToPlace}
          RETURNING id, user_id
          )
        INSERT INTO drafts(user_id, recipient_id) 
        SELECT user_id, id FROM new_recipient
        RETURNING *`,
    [...params],
  ];
};
