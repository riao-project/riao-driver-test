import 'jasmine';
import { connectionTest } from './connection-test';
import { ddlCreateTableTest } from './ddl-create-table-test';
import { dmlTest } from './dml-test';
import { TestOptions } from './test-options';

export const test = (options: TestOptions) => {
	connectionTest(options);
	ddlCreateTableTest(options);
	dmlTest(options);
};
