import { DatabaseConnectionOptions, DatabaseDriver } from 'riao-dbal/src';

export interface TestOptions {
	name: string;
	driver: DatabaseDriver;
	expectedVersion: RegExp;
	connectionOptions: DatabaseConnectionOptions;
}
