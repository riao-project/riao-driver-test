import { Database, QueryRepository } from '@riao/dbal';
import { TestOptions } from './test-options';
import { User } from './dml-data';

export interface TestDependencies {
	db: () => Database;
	repo: () => QueryRepository<User>;
	options: () => TestOptions;
}
