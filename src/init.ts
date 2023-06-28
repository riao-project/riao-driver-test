import { TestOptions } from './test-options';
import { Database } from '@riao/dbal';

/**
 * Setup the db server with a database for testing
 *
 * @param options Test options
 */
async function recreateDatabase(options: TestOptions): Promise<void> {
	const db = new (options.db as { new (): Database })();

	db.name = 'testdb';

	await db.init({
		connectionOptions: {
			...options.connectionOptions,
			database: options.rootDatabase,
		},
	});

	await db.ddl.dropDatabase({
		name: options.connectionOptions.database,
		ifExists: true,
	});

	await db.ddl.createDatabase({ name: options.connectionOptions.database });
	await db.disconnect();
}

export async function getDatabase(options: TestOptions, recreate = false) {
	const name = options.name + '-' + options.connectionOptions.database;

	if (recreate) {
		await recreateDatabase(options);
	}

	const db = new (options.db as { new (): Database })();

	db.name = 'testdb';
	await db.init({
		connectionOptions: options.connectionOptions,
	});

	return db;
}
