import { TestOptions } from './test-options';
import { Database } from 'riao-dbal/src';

/**
 * Setup the db server with a database & user for testing
 *
 * @param options Test options
 */
async function createDatabase(options: TestOptions): Promise<void> {
	const db = new (options.db as { new (): Database })();

	await db.setup({
		host: options.connectionOptions.host,
		port: options.connectionOptions.port,
		username: options.rootUsername,
		password: options.rootPassword,
		database: options.rootDatabase,
	});

	await db.init();

	await db.ddl.dropDatabase({
		name: options.connectionOptions.database,
		ifExists: true,
	});

	await db.ddl.dropUser({
		names: options.connectionOptions.username,
		ifExists: true,
	});

	await db.ddl.createDatabase({ name: options.connectionOptions.database });
	await db.ddl.createUser({
		name: options.connectionOptions.username,
		password: options.connectionOptions.password,
	});

	await db.ddl.grant({
		privileges: 'ALL',
		on: '*',
		to: options.connectionOptions.username,
	});
}

async function initDatabase(options: TestOptions): Promise<Database> {
	await createDatabase(options);

	const db = new (options.db as { new (): Database })();

	await db.setup(options.connectionOptions);

	await db.init();

	return db;
}

const databases: { [key: string]: Database } = {};

export async function getDatabase(options: TestOptions) {
	if (!databases[options.name]) {
		databases[options.name] = await initDatabase(options);
	}

	return databases[options.name];
}
