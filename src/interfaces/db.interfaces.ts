export interface IDatabase {
  create(key: string, value: unknown): unknown;

  read(key: string): unknown;

  update(key: string, updated: unknown): unknown;

  delete(key: string): unknown;
}
