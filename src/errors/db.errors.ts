import { AbstractError } from './abstract.error';

export class DatabaseReadError extends AbstractError {}

export class DatabaseCreateError extends AbstractError {}

export class DatabaseUpdateError extends AbstractError {}

export class DatabaseDeleteError extends AbstractError {}

export class DatabaseInitError extends AbstractError {}
