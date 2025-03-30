import 'jasmine';
import { Database, IntColumnOptions } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';
import { IntKeyColumn, NameColumn } from '@riao/dbal/column-pack';

export const ddlDropTriggerTest = (di: TestDependencies) =>
	describe('Drop Trigger', () => {
		let db: Database;
		const table = 'drop_trigger_table';

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: table,
				columns: [
					<IntColumnOptions>{ ...IntKeyColumn, autoIncrement: false },
					NameColumn,
				],
			});

			await db.ddl.createTrigger({
				name: 'drop_trigger',
				table,
				timing: 'BEFORE',
				event: 'UPDATE',
				body: db
					.getQueryBuilder()
					.disablePlaceholders()
					.triggerSetValue({
						table: table,
						idColumn: 'id',
						column: 'name',
						value: 'updated',
					}),
			});
		});

		it('can drop a trigger', async () => {
			const ddl = db.getDataDefinitionRepository();

			await ddl.dropTrigger({
				name: 'drop_trigger',
				table,
			});

			const dml = db.getQueryRepository();

			// Insert a row to test the trigger
			await dml.insert({
				table: table,
				records: { id: 1, name: 'not-updated' },
			});

			// Update the row to check if the trigger is still active
			await dml.update({
				table: table,
				set: { id: 1 },
				where: { id: 1 },
			});

			// Fetch the row to verify the 'updated_at' column was not updated by the trigger
			const result = await dml.find({
				table: table,
				columns: ['name'],
				where: { id: 1 },
			});

			expect(result[0].name).toEqual('not-updated');
		});

		it('throws an error when dropping a non-existent trigger without ifExists', async () => {
			await expectAsync(
				db.ddl.dropTrigger({
					name: 'non_existent_trigger',
					table: table,
				})
			).toBeRejected();
		});

		it('can drop a trigger if exists', async () => {
			await db.ddl.dropTrigger({
				name: 'non_existent_trigger',
				table: table,
				ifExists: true,
			});
		});
	});
