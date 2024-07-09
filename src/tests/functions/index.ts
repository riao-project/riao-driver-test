import 'jasmine';
import { TestDependencies } from '../../dependency-injection';
import { countTest } from './count-test';
import { minTest } from './min-test';
import { maxTest } from './max-test';
import { currentTimestampTest } from './current-timestamp-test';
import { sumTest } from './sum-test';
import { averageTest } from './average-test';
import { dateTest } from './date-test';
import { yearTest } from './year-test';

export function functionsTest(di: TestDependencies) {
	averageTest(di);
	countTest(di);
	minTest(di);
	maxTest(di);
	sumTest(di);
	currentTimestampTest(di);
	dateTest(di);
	yearTest(di);
}
