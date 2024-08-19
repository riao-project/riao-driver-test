import 'jasmine';
import { getDatabase } from './init';
import { Database, QueryRepository } from '@riao/dbal';
import { User, createQueryTestData } from './dml-data';
import { TestDependencies } from './dependency-injection';

import { connectionTest } from './tests/connection-test';
import { ddlConstraintsTest } from './tests/ddl-constraints';
import { ddlCreateTableTest } from './tests/ddl-create-table-test';
import { ddlDropTableTest } from './tests/ddl-drop-table-test';
import { ddlTruncateTableTest } from './tests/ddl-truncate-table-test';
import { dmlInsertTest } from './tests/dml-insert-test';
import { TestOptions } from './test-options';
import { ddlAlterTableTest } from './tests/ddl-alter-table-test';
import { ddlCreateDatabaseTest } from './tests/ddl-create-database-test';
import { schemaQueryRepositoryTest } from './tests/schema-query-repository-test';
import { dmlCountTest } from './tests/dml-count-test';
import { dmlFindOneOrFailTest } from './tests/dml-find-one-or-fail-test';
import { dmlFindOneTest } from './tests/dml-find-one-test';
import { dmlFindTest } from './tests/dml-find-test';
import { dmlUpdateTest } from './tests/dml-update-test';
import { dmlDeleteTest } from './tests/dml-delete-test';
import { dmlJoinTest } from './tests/dml-join-test';
import { columnTypesTest } from './tests/column-types';
import { functionsTest } from './tests/functions';
import { transactionTest } from './tests/transaction-test';

export const test = (options: TestOptions) =>
	describe(options.db.name, () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

		let db: Database;
		let repo: QueryRepository<User>;

		const injector: TestDependencies = {
			db: () => db,
			repo: () => repo,
			options: () => options,
		};

		beforeAll(async () => {
			db = await getDatabase(options, true);
			repo = await createQueryTestData(db);
		});

		afterAll(async () => {
			await db.disconnect();
		});

		connectionTest(injector);
		columnTypesTest(injector);
		ddlAlterTableTest(injector);
		ddlConstraintsTest(injector);
		ddlCreateDatabaseTest(injector);
		ddlCreateTableTest(injector);
		ddlDropTableTest(injector);
		ddlTruncateTableTest(injector);
		dmlCountTest(injector);
		dmlDeleteTest(injector);
		dmlFindOneOrFailTest(injector);
		dmlFindOneTest(injector);
		dmlFindTest(injector);
		dmlInsertTest(injector);
		dmlJoinTest(injector);
		dmlUpdateTest(injector);
		schemaQueryRepositoryTest(injector);
		transactionTest(injector);

		functionsTest(injector);
	});
