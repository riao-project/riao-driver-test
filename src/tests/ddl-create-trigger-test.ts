import 'jasmine';
import { ColumnType, Database, QueryRepository } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

export const ddlCreateTriggerTest = (di: TestDependencies) =>
	describe('Create Trigger', () => {
		let db: Database;
		let audits: QueryRepository<AuditEntry>;

		beforeAll(async () => {
			db = di.db();

			await createAuditTable();

			audits = db.getQueryRepository({
				table: 'trigger_audit_log',
				identifiedBy: 'slug',
			});
		});

		it('can create a trigger for BEFORE INSERT', async () => {
			const slug = 'before_insert';
			const repo = await createRecordTable(slug);
			const qb = db.getQueryBuilder().disablePlaceholders();

			await db.ddl.createTrigger({
				name: slug + '_trigger',
				table: repo.getTableName(),
				timing: 'BEFORE',
				event: 'INSERT',
				body: qb.triggerSetValue({
					table: repo.getTableName(),
					idColumn: 'slug',
					column: 'result',
					value: 'triggered',
				}),
			});

			await insertRecord(repo, slug);
			await checkResultColumn(repo, slug);
		});

		it('can update a trigger for BEFORE UPDATE', async () => {
			const slug = 'before_update';
			const repo = await createRecordTable(slug);
			const qb = db.getQueryBuilder().disablePlaceholders();

			await db.ddl.createTrigger({
				name: slug + '_trigger',
				table: repo.getTableName(),
				timing: 'BEFORE',
				event: 'UPDATE',
				body: qb.triggerSetValue({
					table: repo.getTableName(),
					idColumn: 'slug',
					column: 'result',
					value: 'triggered',
				}),
			});

			await insertRecord(repo, slug);
			await repo.update({
				set: { name: 'test' },
				where: { slug },
			});

			await checkResultColumn(repo, slug);
		});

		it('can create a trigger for AFTER INSERT', async () => {
			const slug = 'after_insert';
			const repo = await createRecordTable(slug);
			const qb = db.getQueryBuilder().disablePlaceholders();

			await db.ddl.createTrigger({
				name: slug + '_trigger',
				table: repo.getTableName(),
				timing: 'AFTER',
				event: 'INSERT',
				body: qb.insert({
					table: 'trigger_audit_log',
					records: {
						slug, // TODO: columnName('OLD.slug'),
					},
				}),
			});

			await insertRecord(repo, slug);

			await checkAuditEntry({ slug });
		});

		it('can create a trigger for AFTER UPDATE', async () => {
			const slug = 'after_update';
			const repo = await createRecordTable(slug);
			const qb = db.getQueryBuilder().disablePlaceholders();

			await db.ddl.createTrigger({
				name: slug + '_trigger',
				table: repo.getTableName(),
				timing: 'AFTER',
				event: 'UPDATE',
				body: qb.insert({
					table: 'trigger_audit_log',
					records: {
						slug, // TODO: columnName('OLD.slug'),
					},
				}),
			});

			await insertRecord(repo, slug);
			await repo.update({ set: { name: 'update' }, where: { slug } });

			await checkAuditEntry({ slug });
		});

		it('can create a trigger for BEFORE DELETE', async () => {
			const slug = 'before_delete';
			const repo = await createRecordTable(slug);
			const qb = db.getQueryBuilder().disablePlaceholders();

			await db.ddl.createTrigger({
				name: slug + '_trigger',
				table: repo.getTableName(),
				timing: 'BEFORE',
				event: 'DELETE',
				body: qb.insert({
					table: 'trigger_audit_log',
					records: {
						slug, // TODO: columnName('OLD.slug'),
					},
				}),
			});

			await insertRecord(repo, slug);
			await repo.delete({ where: { slug } });

			await checkAuditEntry({ slug });
		});

		it('can create a trigger for AFTER DELETE', async () => {
			const slug = 'after_delete';
			const repo = await createRecordTable(slug);
			const qb = db.getQueryBuilder().disablePlaceholders();

			await db.ddl.createTrigger({
				name: slug + '_trigger',
				table: repo.getTableName(),
				timing: 'AFTER',
				event: 'DELETE',
				body: qb.insert({
					table: 'trigger_audit_log',
					records: {
						slug, // TODO: columnName('OLD.slug'),
					},
				}),
			});

			await insertRecord(repo, slug);
			await repo.delete({ where: { slug } });

			await checkAuditEntry({ slug });
		});

		it('only updates the correct row', async () => {
			const slug1 = 'row1';
			const slug2 = 'row2';
			const repo = await createRecordTable('update_correct_row');
			const qb = db.getQueryBuilder().disablePlaceholders();

			await insertRecord(repo, slug1);
			await insertRecord(repo, slug2);

			await db.ddl.createTrigger({
				name: 'update_correct_row_trigger',
				table: repo.getTableName(),
				timing: 'BEFORE',
				event: 'UPDATE',
				body: qb.triggerSetValue({
					table: repo.getTableName(),
					idColumn: 'slug',
					column: 'result',
					value: 'triggered',
				}),
			});

			await repo.update({
				set: { name: 'test' },
				where: { slug: slug1 },
			});

			const result1 = await repo.findOne({ where: { slug: slug1 } });
			const result2 = await repo.findOne({ where: { slug: slug2 } });

			expect(result1).toBeDefined();
			expect(result1.result).toEqual('triggered');

			expect(result2).toBeDefined();
			expect(result2.result).toBeNull();
		});

		// TODO: Add test for other types of trigger bodys (e.g. inserting other records, deleting things, complex updates, inserts into other tables, etc.)

		async function createRecordTable(
			slug: string
		): Promise<QueryRepository<TableEntry>> {
			const name = `trigger_${slug}_test`;

			await db.ddl.createTable({
				name,
				columns: [
					{
						type: ColumnType.VARCHAR,
						name: 'slug',
						primaryKey: true,
						length: 255,
					},
					{ type: ColumnType.TEXT, name: 'name' },
					{ type: ColumnType.TEXT, name: 'result' },
				],
			});

			return db.getQueryRepository({
				table: name,
				identifiedBy: 'slug',
			});
		}

		async function createAuditTable() {
			await db.ddl.createTable({
				name: 'trigger_audit_log',
				columns: [
					{
						type: ColumnType.VARCHAR,
						name: 'slug',
						primaryKey: true,
						length: 255,
					},
				],
			});
		}

		async function insertRecord(
			repo: QueryRepository<TableEntry>,
			slug: string
		) {
			await repo.insert({ records: { slug } });
		}

		async function checkResultColumn(
			repo: QueryRepository<TableEntry>,
			slug: string
		): Promise<void> {
			const result = await repo.findOne({ where: { slug } });

			expect(result).toBeDefined();
			expect(result.result).toEqual('triggered');
		}

		async function checkAuditEntry(options: { slug: string }) {
			const auditResult = await audits.find({
				where: options,
			});

			expect(auditResult.length).toBeGreaterThan(0);
			expect(auditResult[0].slug).toEqual(options.slug);
		}
	});

interface TableEntry {
	slug: string;
	name: string;
	result?: string;
}

interface AuditEntry {
	slug: string;
}
