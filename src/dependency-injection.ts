import { Database, QueryRepository } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { User } from './dml-data';

export interface TestDependencies {
	db: () => Database;
	repo: () => QueryRepository<User>;
	options: () => TestOptions;
}
