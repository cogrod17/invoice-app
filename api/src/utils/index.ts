export const validateProperties = (
  validKeys: string[],
  objectToCheck: object
): boolean =>
  Object.keys(objectToCheck).every((key) => validKeys.includes(key));
