import { QueryParams } from "../types";

export const matchValuesForQuery = (
  obj: object
): [string[], string[], QueryParams[]] => {
  const cols: string[] = [];
  const params: QueryParams[] = [];
  const placeholders: string[] = [];
  const entries = Object.entries(obj);
  for (let j = 0; j < entries.length; j++) {
    const [key, value] = entries[j];
    cols.push(key);
    params.push(value);
    placeholders.push(`$${j + 1}`);
  }

  return [cols, placeholders, params];
};
