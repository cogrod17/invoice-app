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
