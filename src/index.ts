import 'jasmine';
import { connectionTest } from './connection-test';
import { ddlCreateTableTest } from './ddl-create-table-test';
import { ddlDropTableTest } from './ddl-drop-table-test';
import { ddlTruncateTableTest } from './ddl-truncate-table-test';
import { dmlTest } from './dml-test';
import { TestOptions } from './test-options';
import { ddlAlterTableTest } from './ddl-alter-table-test';
import { ddlCreateDatabaseTest } from './ddl-create-database-test';

export const test = (options: TestOptions) => {
	connectionTest(options);
	ddlAlterTableTest(options);
	ddlCreateDatabaseTest(options);
	ddlCreateTableTest(options);
	ddlDropTableTest(options);
	ddlTruncateTableTest(options);
	dmlTest(options);
};
