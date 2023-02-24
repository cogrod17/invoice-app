import { Response } from "express";
import { TypedReqBody, Recipient } from "../../../types";
import { isValidRecipient } from "../utils";
import { createInvoiceQuery } from "../queries/createInvoice";
import db from "../../../database";

export const createInvoice = async (
  req: TypedReqBody<Recipient>,
  res: Response
) => {
  try {
    const recipient = req.body;
    if (!req.user_id) return res.send(401);
    if (!isValidRecipient(recipient))
      return res.status(400).send({ detail: "please enter valid recipient" });

    const { rows } = await db.query(
      ...createInvoiceQuery(recipient, req.user_id)
    );

    res.status(200).send({ ...rows[0] });
  } catch (e) {
    console.log(e);
    res.send({ detail: "There was an error creating the draft" });
  }
};
