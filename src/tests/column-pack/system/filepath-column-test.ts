import 'jasmine';
import { Database } from '@riao/dbal';
import { FilepathColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const filepathColumnTest = (di: TestDependencies) =>
	describe('Column Pack - FilepathColumn', () => {
		let db: Database;
		const table = 'filepath_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a filepath column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [FilepathColumn],
			});

			const repo = db.getQueryRepository({ table });

			const filepath =
				'C:\\Users\\SomeoneWithALongName\\Documents\\My Folder\\Testing\\Word Documents\\some-long-text-file-name-for-testing-purposes.docx';

			await repo.insertOne({
				record: { filepath },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.filepath).toEqual(filepath);
		});
	});
