import 'jasmine';
import { connectionTest } from './connection-test';
import { ddlCreateTableTest } from './ddl-create-table-test';
import { ddlDropTableTest } from './ddl-drop-table-test';
import { ddlTruncateTableTest } from './ddl-truncate-table-test';
import { dmlTest } from './dml-insert-test';
import { TestOptions } from './test-options';
import { ddlAlterTableTest } from './ddl-alter-table-test';
import { ddlCreateDatabaseTest } from './ddl-create-database-test';
import { ddlGrantTest } from './ddl-grant-test';
import { schemaQueryRepositoryTest } from './schema-query-repository-test';

export const test = (options: TestOptions) => {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
	connectionTest(options);
	ddlAlterTableTest(options);
	ddlCreateDatabaseTest(options);
	ddlCreateTableTest(options);
	ddlDropTableTest(options);
	ddlGrantTest(options);
	ddlTruncateTableTest(options);
	dmlTest(options);
	schemaQueryRepositoryTest(options);
};
