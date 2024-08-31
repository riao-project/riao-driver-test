import 'jasmine';
import { Database } from '@riao/dbal';
import { UrlColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const urlColumnTest = (di: TestDependencies) =>
	describe('Column Pack - UrlColumn', () => {
		let db: Database;
		const table = 'url_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a url column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [UrlColumn],
			});

			const repo = db.getQueryRepository({ table });

			const url =
				'http://llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.co.uk/photo/young-woman-standing-in-a-field-of-yellow-flowers-gm504532898-84272970';

			await repo.insertOne({
				record: { url },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.url).toEqual(url);
		});
	});
