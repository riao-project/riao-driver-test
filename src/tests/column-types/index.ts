import 'jasmine';
import { TestDependencies } from '../../dependency-injection';

import { blobTest } from './blob-test';
import { boolTest } from './bool-test';
import { dateTimeTest } from './date-time-test';
import { decimalTest } from './decimal-test';
import { integerTest } from './integer-test';
import { textTest } from './text-test';
import { uuidTest } from './uuid-test';

export function columnTypesTest(di: TestDependencies) {
	blobTest(di);
	boolTest(di);
	dateTimeTest(di);
	decimalTest(di);
	integerTest(di);
	textTest(di);
	uuidTest(di);
}
