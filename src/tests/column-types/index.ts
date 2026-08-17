import 'jasmine';
import { TestDependencies } from '../../dependency-injection';

// Binary types
import { blobTest } from './binary/blob-test';

// Boolean types
import { boolTest } from './boolean/bool-test';

// Date and time types
import { dateTest } from './dates/date-test';
import { timeTest } from './dates/time-test';
import { timestampTest } from './dates/timestamp-test';

// Decimal types
import { decimalTest } from './decimals/decimal-test';
import { floatTest } from './decimals/float-test';
import { doubleTest } from './decimals/double-test';

// Integer types
import { tinyintTest } from './integers/tinyint-test';
import { smallintTest } from './integers/smallint-test';
import { intTest } from './integers/int-test';
import { bigintTest } from './integers/bigint-test';

// Text types
import { charTest } from './text/char-test';
import { varcharTest } from './text/varchar-test';
import { textTest } from './text/text-test';

// JSON types
import { jsonTest } from './json/json-test';

// UUID types
import { uuidTest } from './uuid/uuid-test';

export function columnTypesTest(di: TestDependencies) {
	// Binary types
	blobTest(di);

	// Boolean types
	boolTest(di);

	// Date and time types
	dateTest(di);
	timeTest(di);
	timestampTest(di);

	// Decimal types
	decimalTest(di);
	floatTest(di);
	doubleTest(di);

	// Integer types
	tinyintTest(di);
	smallintTest(di);
	intTest(di);
	bigintTest(di);

	// Text types
	charTest(di);
	varcharTest(di);
	textTest(di);

	// JSON types
	jsonTest(di);

	// UUID types
	uuidTest(di);
}
