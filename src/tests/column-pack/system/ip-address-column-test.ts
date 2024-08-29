import 'jasmine';
import { Database } from '@riao/dbal';
import { IpAddressColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const ipAddressColumnTest = (di: TestDependencies) =>
	describe('Column Pack - IPAddressColumn', () => {
		let db: Database;
		const table = 'ip_address_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a ip_address column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [IpAddressColumn],
			});

			const repo = db.getQueryRepository({ table });

			const ip_address = '192.168.1.120';

			await repo.insertOne({
				record: { ip_address },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.ip_address).toEqual(ip_address);
		});
	});
