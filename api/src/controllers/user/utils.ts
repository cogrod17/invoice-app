import { UserCredentials } from "./types";

type TextParamsFormatted = {
  text: string;
  params: any[]; //eslint-disable-line
};

type GenUpdateArgs = {
  table: "users";
  body: object;
  item_id: number;
  returning: string;
};

type GenUpdateQueryById = (args: GenUpdateArgs) => TextParamsFormatted;

export const generateUpdateQueryById: GenUpdateQueryById = ({
  table,
  body,
  item_id,
  returning,
}) => ({
  text:
    `UPDATE ${table} SET ` +
    Object.keys(body)
      .map(
        (key, i, arr) =>
          `${key} = $${i + 1}${
            i + 1 === arr.length ? ` WHERE id = $${arr.length + 1}` : ""
          }`
      )
      .join(", ") +
    ` RETURNING ${returning}`,
  params: [...Object.values(body), item_id],
});

export const validCredentials = (user: unknown): user is UserCredentials => {
  if (!user) return false;
  if (typeof user !== "object") return false;

  return (
    "email" in (user as UserCredentials) &&
    "password" in (user as UserCredentials)
  );
};
