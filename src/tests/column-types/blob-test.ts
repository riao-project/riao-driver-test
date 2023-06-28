import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

export const blobTest = (di: TestDependencies) =>
	describe('Data Types - Blob', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('supports blob column', async () => {
			const table = 'blob_column_test';

			const strlen = 255;
			const startCode = 0;
			const codeRange = 65535;
			let str = '';

			for (let i = 0; i < strlen; i++) {
				str += String.fromCharCode(
					Math.round(Math.random() * codeRange) + startCode
				);
			}

			const buf = Buffer.from(str);

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.BLOB,
						name: 'bin_val',
					},
				],
			});

			await db.query.insert({
				table,
				records: { bin_val: buf },
			});

			const records = await db.query.find({ table });

			const returnedBuffer = Buffer.from(records[0].bin_val);

			expect(records.length).toEqual(1);
			expect(returnedBuffer).toEqual(buf);
		});
	});
