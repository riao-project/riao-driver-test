import 'jasmine';
import { Database } from '@riao/dbal';
import { FilenameColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const filenameColumnTest = (di: TestDependencies) =>
	describe('Column Pack - FilenameColumn', () => {
		let db: Database;
		const table = 'filename_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a filename column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [FilenameColumn],
			});

			const repo = db.getQueryRepository({ table });

			const filename =
				'some-long-text-file-name-for-testing-purposes.docx';

			await repo.insertOne({
				record: { filename },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.filename).toEqual(filename);
		});
	});
