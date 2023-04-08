import { TestOptions } from './test-options';
import { Database } from 'riao-dbal/src';

async function initDatabase(options: TestOptions): Promise<Database> {
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
