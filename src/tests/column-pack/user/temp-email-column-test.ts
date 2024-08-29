import 'jasmine';
import { Database } from '@riao/dbal';
import { TempEmailColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const tempEmailColumnTest = (di: TestDependencies) =>
	describe('Column Pack - TempEmailColumn', () => {
		let db: Database;
		const table = 'temp_email_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a temp_email column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [TempEmailColumn],
			});

			const repo = db.getQueryRepository({ table });

			const temp_email =
				'some_long_email_address@some_long_domain.some_long_top_level_domain';

			await repo.insertOne({
				record: { temp_email },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.temp_email).toEqual(temp_email);
		});
	});
