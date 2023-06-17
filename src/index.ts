import 'jasmine';
import { getDatabase } from './init';
import { Database, QueryRepository } from 'riao-dbal/src';
import { User, createQueryTestData } from './dml-data';
import { TestDependencies } from './dependency-injection';

import { connectionTest } from './tests/connection-test';
import { ddlCreateTableTest } from './tests/ddl-create-table-test';
import { ddlDropTableTest } from './tests/ddl-drop-table-test';
import { ddlTruncateTableTest } from './tests/ddl-truncate-table-test';
import { dmlInsertTest } from './tests/dml-insert-test';
import { TestOptions } from './test-options';
import { ddlAlterTableTest } from './tests/ddl-alter-table-test';
import { ddlCreateDatabaseTest } from './tests/ddl-create-database-test';
import { schemaQueryRepositoryTest } from './tests/schema-query-repository-test';
import { dmlFindOneOrFailTest } from './tests/dml-find-one-or-fail-test';
import { dmlFindOneTest } from './tests/dml-find-one-test';
import { dmlFindTest } from './tests/dml-find-test';
import { dmlUpdateTest } from './tests/dml-update-test';
import { dmlDeleteTest } from './tests/dml-delete-test';
import { dmlJoinTest } from './tests/dml-join-test';
import { columnTypesTest } from './tests/column-types-test';
import { boolTest } from './tests/column-types';

export const test = (options: TestOptions) => {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
	connectionTest(options);
	boolTest(options);
	columnTypesTest(options);
	ddlAlterTableTest(options);
	ddlCreateDatabaseTest(options);
	ddlCreateTableTest(options);
	ddlDropTableTest(options);
	ddlTruncateTableTest(options);
	dmlDeleteTest(options);
	dmlFindOneOrFailTest(options);
	dmlFindOneTest(options);
	dmlFindTest(options);
	dmlInsertTest(options);
	dmlJoinTest(options);
	dmlUpdateTest(options);
	schemaQueryRepositoryTest(options);
};
