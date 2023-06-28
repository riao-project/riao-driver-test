import 'jasmine';
import { ColumnType, Database, QueryRepository } from '@riao/dbal';

export interface User {
	myid: number;
	fname: string;
	email: string;
}

export async function createQueryTestData(
	db: Database
): Promise<QueryRepository<User>> {
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

	const userRepo = db.getQueryRepository<User>({
		table: 'query_test',
	});

	await userRepo.insert({
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

	return userRepo;
}
