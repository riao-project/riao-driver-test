import { DatabaseConnectionOptions, Database } from 'riao-dbal/src';

export interface TestOptions {
	name: string;
	db: typeof Database;
	expectedVersion: RegExp;
	connectionOptions: DatabaseConnectionOptions;
	rootUsername: string;
	rootPassword: string;
	rootDatabase: string;
}
