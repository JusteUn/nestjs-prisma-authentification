export function exclude<T, Key extends keyof T>(
  table: T,
  keys: Key[],
): Omit<T, Key> {
  for (const key of keys) {
    delete table[key];
  }
  return table;
}
