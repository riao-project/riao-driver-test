import 'jasmine';
import { connectionTest } from './connection-test';
import { TestOptions } from './test-options';

export const test = (options: TestOptions) => {
	connectionTest(options);
};
