import { DatabaseConnectionOptions, DatabaseDriver } from 'riao-dbal/src';

export interface TestOptions {
	name: string;
	driver: typeof DatabaseDriver;
	expectedVersion: RegExp;
	connectionOptions: DatabaseConnectionOptions;
}
