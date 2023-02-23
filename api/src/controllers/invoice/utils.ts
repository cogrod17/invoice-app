import { Recipient } from "../../types";

const validRecipientKeys = [
  "name",
  "email",
  "user_id",
  "address1",
  "state",
  "city",
  "zip",
  "phone",
];

export const isValidRecipient = (
  recipient: unknown
): recipient is Recipient => {
  if (!recipient) return false;
  if (typeof recipient !== `object`) return false;

  if (!Object.keys(recipient).every((key) => validRecipientKeys.includes(key)))
    return false;

  return (
    "email" in (recipient as Recipient) && "name" in (recipient as Recipient)
  );
};
