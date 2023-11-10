import 'jasmine';
import { TestDependencies } from '../../dependency-injection';
import { currentTimestampTest } from './current-timestamp-test';
import { countTest } from './count-test';

export function functionsTest(di: TestDependencies) {
	countTest(di);
	currentTimestampTest(di);
}
