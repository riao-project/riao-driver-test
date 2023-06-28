import { DatabaseConnectionOptions, Database } from '@riao/dbal';

export interface TestOptions {
	name: string;
	db: typeof Database;
	expectedVersion: RegExp;
	connectionOptions: DatabaseConnectionOptions;
	rootDatabase: string;
}
