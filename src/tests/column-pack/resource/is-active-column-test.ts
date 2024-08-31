import 'jasmine';
import { ColumnType, Database, QueryRepository } from '@riao/dbal';
import { IsActiveColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const isActiveColumnTest = (di: TestDependencies) =>
	describe('Column Pack - IsActiveColumn', () => {
		let db: Database;
		const table = 'is_active_column_test';
		let repo: QueryRepository;

		beforeAll(async () => {
			db = di.db();

			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					IsActiveColumn,
					{ name: 'text', type: ColumnType.VARCHAR, length: 255 },
				],
			});

			repo = db.getQueryRepository({ table });

			await repo.insert({
				records: [
					{ text: 'default' },
					{ text: 'true', is_active: true },
					{ text: 'false', is_active: false },
				],
			});
		});

		it('can create an is_active column', async () => {
			const result = await repo.findOne({ where: { text: 'true' } });

			expect(result.is_active).toBeTruthy();
		});

		it('defaults to false', async () => {
			const result = await repo.findOne({ where: { text: 'default' } });

			expect(result.is_active).toBeFalsy();
		});

		it('can be set to false', async () => {
			const result = await repo.findOne({ where: { text: 'false' } });

			expect(result.is_active).toBeFalsy();
		});
	});
