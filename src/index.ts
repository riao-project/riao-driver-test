import 'jasmine';
import { connectionTest } from './connection-test';
import { ddlCreateTableTest } from './ddl-create-table-test';
import { ddlDropTableTest } from './ddl-drop-table-test';
import { ddlTruncateTableTest } from './ddl-truncate-table-test';
import { dmlInsertTest } from './dml-insert-test';
import { TestOptions } from './test-options';
import { ddlAlterTableTest } from './ddl-alter-table-test';
import { ddlCreateDatabaseTest } from './ddl-create-database-test';
import { ddlGrantTest } from './ddl-grant-test';
import { schemaQueryRepositoryTest } from './schema-query-repository-test';
import { dmlFindOneOrFailTest } from './dml-find-one-or-fail-test';
import { dmlFindOneTest } from './dml-find-one-test';
import { dmlFindTest } from './dml-find-test';
import { dmlUpdateTest } from './dml-update-test';
import { dmlDeleteTest } from './dml-delete-test';
import { dmlJoinTest } from './dml-join-test';
import { columnTypesTest } from './column-types-test';

export const test = (options: TestOptions) => {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
	connectionTest(options);
	columnTypesTest(options);
	ddlAlterTableTest(options);
	ddlCreateDatabaseTest(options);
	ddlCreateTableTest(options);
	ddlDropTableTest(options);
	ddlGrantTest(options);
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
