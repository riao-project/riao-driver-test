import 'jasmine';
import { TestDependencies } from '../../dependency-injection';
import { currentTimestampTest } from './current-timestamp-test';

export function functionsTest(di: TestDependencies) {
	currentTimestampTest(di);
}
