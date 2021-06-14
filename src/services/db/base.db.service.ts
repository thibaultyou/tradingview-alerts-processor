export abstract class BaseDatabaseService {
  abstract create(key: string, value: unknown): unknown;

  abstract read(key: string): unknown;

  abstract update(key: string, updated: unknown): unknown;

  abstract delete(key: string): unknown;
}
