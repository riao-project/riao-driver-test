import 'jasmine';
import { ColumnType, QueryRepository } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export interface User {
	myid: number;
	fname: string;
	email: string;
}

interface DatabaseQueryTestData {
	hasStartedData?: boolean;
	hasCreatedData?: boolean;
	userRepo?: QueryRepository<User>;
}

const databases: Record<string, DatabaseQueryTestData> = {};

export async function createQueryTestData(
	options: TestOptions
): Promise<QueryRepository<User>> {
	if (!(options.name in databases)) {
		databases[options.name] = {};
	}

	if (databases[options.name].hasCreatedData) {
		return databases[options.name].userRepo;
	}
	else if (databases[options.name].hasStartedData) {
		do {
			await new Promise((a, r) => setTimeout(a, 25));
		} while (!databases[options.name].hasCreatedData);

		return databases[options.name].userRepo;
	}

	databases[options.name].hasStartedData = true;

	const db = await getDatabase(options);

	await db.ddl.dropTable({
		tables: 'query_test',
		ifExists: true,
	});

	await db.ddl.createTable({
		name: 'query_test',
		columns: [
			{
				name: 'myid',
				type: ColumnType.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			{
				name: 'fname',
				type: ColumnType.VARCHAR,
				length: 255,
			},
			{
				name: 'email',
				type: ColumnType.VARCHAR,
				length: 1024,
			},
		],
	});

	databases[options.name].userRepo = db.getQueryRepository<User>({
		table: 'query_test',
	});

	await databases[options.name].userRepo.insert({
		records: [
			{
				fname: 'Bob',
				email: 'bob@myusers.com',
			},
			{
				fname: 'Tom',
				email: 'tom@myusers.com',
			},
		],
	});

	databases[options.name].hasCreatedData = true;

	return databases[options.name].userRepo;
}
