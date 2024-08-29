import 'jasmine';
import { Database } from '@riao/dbal';
import { UsernameColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const usernameColumnTest = (di: TestDependencies) =>
	describe('Column Pack - UsernameColumn', () => {
		let db: Database;
		const table = 'username_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a username column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [UsernameColumn],
			});

			const repo = db.getQueryRepository({ table });

			const username = 'somereallylongusernamefortestingpurposes99';

			await repo.insertOne({
				record: { username },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.username).toEqual(username);
		});
	});
