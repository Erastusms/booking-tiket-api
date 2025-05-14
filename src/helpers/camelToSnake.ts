export const camelToSnake = (obj: Record<string, any>): Record<string, any> => {
  const toSnake = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const result: Record<string, any> = {};

  for (const key in obj) {
    const newKey = toSnake(key);
    result[newKey] =
      typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])
        ? camelToSnake(obj[key])
        : obj[key];
  }

  return result;
};
