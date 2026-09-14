import 'jasmine';
import {
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
	columnName,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

interface ConcatTestRecord {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}

export const concatTest = (di: TestDependencies) =>
	describe('Concat()', () => {
		let db: Database;
		let repo: QueryRepository<ConcatTestRecord>;
		const table = 'concat_test';

		beforeAll(async () => {
			db = di.db();
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
						autoIncrement: true,
						primaryKey: true,
					},
					{
						name: 'firstName',
						type: ColumnType.VARCHAR,
						length: 100,
					},
					{
						name: 'lastName',
						type: ColumnType.VARCHAR,
						length: 100,
					},
					{
						name: 'email',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});

			repo = db.getQueryRepository({ table });

			await repo.insert({
				records: [
					{
						firstName: 'John',
						lastName: 'Doe',
						email: 'john@example.com',
					},
					{
						firstName: 'Jane',
						lastName: 'Smith',
						email: 'jane@example.com',
					},
					{
						firstName: 'Bob',
						lastName: 'Johnson',
						email: 'bob@example.com',
					},
				],
			});
		});

		it('can concat string literals', async () => {
			const results: any = await repo.findOne({
				columns: [
					{
						query: DatabaseFunctions.concat('Hello', ' ', 'World'),
						as: 'result',
					},
				],
			});

			expect(results.result).toEqual('Hello World');
		});

		it('can concat column values', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.concat(
							columnName('firstName'),
							' ',
							columnName('lastName')
						),
						as: 'fullName',
					},
				],
				orderBy: { id: 'ASC' },
			});

			expect(results.length).toEqual(3);
			expect(results[0].fullName).toEqual('John Doe');
			expect(results[1].fullName).toEqual('Jane Smith');
			expect(results[2].fullName).toEqual('Bob Johnson');
		});

		it('can concat multiple column values', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.concat(
							columnName('firstName'),
							' ',
							columnName('lastName'),
							' <',
							columnName('email'),
							'>'
						),
						as: 'fullInfo',
					},
				],
				orderBy: { id: 'ASC' },
			});

			expect(results.length).toEqual(3);
			expect(results[0].fullInfo).toEqual('John Doe <john@example.com>');
			expect(results[1].fullInfo).toEqual('Jane Smith <jane@example.com>');
			expect(results[2].fullInfo).toEqual('Bob Johnson <bob@example.com>');
		});

		it('can concat with mix of literals and columns', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.concat(
							'Name: ',
							columnName('firstName'),
							' ',
							columnName('lastName')
						),
						as: 'result',
					},
				],
				orderBy: { id: 'ASC' },
			});

			expect(results.length).toEqual(3);
			expect(results[0].result).toEqual('Name: John Doe');
			expect(results[1].result).toEqual('Name: Jane Smith');
			expect(results[2].result).toEqual('Name: Bob Johnson');
		});

		it('can concat single column', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.concat(columnName('email')),
						as: 'emailResult',
					},
				],
				orderBy: { id: 'ASC' },
			});

			expect(results.length).toEqual(3);
			expect(results[0].emailResult).toEqual('john@example.com');
			expect(results[1].emailResult).toEqual('jane@example.com');
			expect(results[2].emailResult).toEqual('bob@example.com');
		});
	});
