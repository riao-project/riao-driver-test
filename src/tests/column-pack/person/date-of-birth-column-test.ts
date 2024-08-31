import 'jasmine';
import { Database } from '@riao/dbal';
import { DateOfBirthColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const dateOfBirthColumnTest = (di: TestDependencies) =>
	describe('Column Pack - DateOfBirthColumn', () => {
		let db: Database;
		const table = 'date_of_birth_key_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a date of birth column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [DateOfBirthColumn],
			});

			await db.buildSchema();

			const repo = db.getQueryRepository({ table });

			await repo.insertOne({
				record: { date_of_birth: '1990-02-03' },
				ignoreReturnId: true,
			});

			const result = await repo.find({});

			expect(result[0].date_of_birth).toEqual(new Date('1990-02-03'));
		});
	});
