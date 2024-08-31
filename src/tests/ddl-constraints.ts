import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

export const ddlConstraintsTest = (di: TestDependencies) =>
	describe('Constraints', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('can enforce and disable foreign key checks', async () => {
			await db.ddl.createTable({
				name: 'constraints_fk_parent',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'name',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});

			await db.ddl.createTable({
				name: 'constraints_fk_child',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'parent',
						type: ColumnType.INT,
					},
				],
				foreignKeys: [
					{
						columns: ['parent'],
						referencesTable: 'constraints_fk_parent',
						referencesColumns: ['id'],
					},
				],
			});

			const { id } = await db.getQueryRepository().insertOne({
				table: 'constraints_fk_parent',
				record: { name: 'test' },
				primaryKey: 'id',
			});

			await expectAsync(
				db.getQueryRepository().insert({
					table: 'constraints_fk_child',
					records: [{ parent: id }],
				})
			).toBeResolved();

			await expectAsync(
				db.getQueryRepository().insert({
					table: 'constraints_fk_child',
					records: [{ parent: 2 }],
				})
			).toBeRejected(); // TODO: Specify error

			await db.getDataDefinitionRepository().disableForeignKeyChecks();

			await expectAsync(
				db.getQueryRepository().insert({
					table: 'constraints_fk_child',
					records: [{ parent: 2 }],
				})
			).toBeResolved();

			await db.getDataDefinitionRepository().enableForeignKeyChecks();

			await expectAsync(
				db.getQueryRepository().insert({
					table: 'constraints_fk_child',
					records: [{ parent: 2 }],
				})
			).toBeRejected(); // TODO: Specify error
		});

		it('can enforce and disable unique checks', async () => {
			await db.ddl.createTable({
				name: 'constraints_unique',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'name',
						type: ColumnType.VARCHAR,
						length: 255,
						isUnique: true,
					},
				],
			});

			await expectAsync(
				db
					.getQueryRepository({ table: 'constraints_unique' })
					.insert({ records: [{ name: 'test' }] })
			).toBeResolved();

			await expectAsync(
				db.getQueryRepository().insert({
					table: 'constraints_unique',
					records: [{ name: 'test' }],
				})
			).toBeRejected(); // TODO: Specify error
		});
	});
