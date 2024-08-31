import 'jasmine';
import { Database } from '@riao/dbal';
import { EmailColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const emailColumnTest = (di: TestDependencies) =>
	describe('Column Pack - EmailColumn', () => {
		let db: Database;
		const table = 'email_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a email column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [EmailColumn],
			});

			const repo = db.getQueryRepository({ table });

			const email =
				'some_long_email_address@some_long_domain.some_long_top_level_domain';

			await repo.insertOne({
				record: { email },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.email).toEqual(email);
		});
	});
