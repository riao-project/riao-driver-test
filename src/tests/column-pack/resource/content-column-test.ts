import 'jasmine';
import { Database } from '@riao/dbal';
import { ContentColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';
import { loremIpsum } from '../../../mock/lorem-ipsum';

export const contentColumnTest = (di: TestDependencies) =>
	describe('Column Pack - ContentColumn', () => {
		let db: Database;
		const table = 'content_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a content column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [ContentColumn],
			});

			const repo = db.getQueryRepository({ table });

			const content = loremIpsum;

			await repo.insertOne({
				record: { content },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.content).toEqual(content);
		});
	});
