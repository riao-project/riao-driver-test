import 'jasmine';
import { Database } from '@riao/dbal';
import { PasswordColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const passwordColumnTest = (di: TestDependencies) =>
	describe('Column Pack - PasswordColumn', () => {
		let db: Database;
		const table = 'password_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a password column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [PasswordColumn],
			});

			const repo = db.getQueryRepository({ table });

			const password =
				'$2y$10$Gv3hPLfXVImJHw/noO62r.1GGvuhPXgdQgvyXeTa7ETANBCj.uLYi';

			await repo.insertOne({
				record: { password },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.password).toEqual(password);
		});
	});
