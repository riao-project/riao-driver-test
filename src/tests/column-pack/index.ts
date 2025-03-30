import 'jasmine';
import { TestDependencies } from '../../dependency-injection';

import { createTimestampColumnTest } from './date-time/create-timestamp-column-test';
import { updateTimestampColumnTest } from './date-time/update-timestamp-column-test';
import { bigIntKeyColumnTest } from './keys/big-int-key-column-test';
import { intKeyColumnTest } from './keys/int-key-column-test';
import { uuidKeyColumnTest } from './keys/uuid-key-column-test';
import { dateOfBirthColumnTest } from './person/date-of-birth-column-test';
import { firstNameColumnTest } from './person/first-name-column-test';
import { lastNameColumnTest } from './person/last-name-column-test';
import { contentColumnTest } from './resource/content-column-test';
import { descriptionColumnTest } from './resource/description-column-test';
import { isActiveColumnTest } from './resource/is-active-column-test';
import { pathColumnTest } from './resource/path-column-test';
import { titleColumnTest } from './resource/title-column-test';
import { filenameColumnTest } from './system/filename-column-test';
import { filepathColumnTest } from './system/filepath-column-test';
import { ipAddressColumnTest } from './system/ip-address-column-test';
import { urlColumnTest } from './system/url-column-test';
import { emailColumnTest } from './user/email-column-test';
import { passwordColumnTest } from './user/password-column-test';
import { tempEmailColumnTest } from './user/temp-email-column-test';
import { usernameColumnTest } from './user/username-column-test';

export function columnPackTest(di: TestDependencies) {
	// Date-Time
	createTimestampColumnTest(di);
	updateTimestampColumnTest(di);

	// Keys
	bigIntKeyColumnTest(di);
	intKeyColumnTest(di);
	uuidKeyColumnTest(di);

	// Person
	dateOfBirthColumnTest(di);
	firstNameColumnTest(di);
	lastNameColumnTest(di);

	// Resource
	contentColumnTest(di);
	descriptionColumnTest(di);
	isActiveColumnTest(di);
	pathColumnTest(di);
	titleColumnTest(di);

	// System
	filenameColumnTest(di);
	filepathColumnTest(di);
	ipAddressColumnTest(di);
	urlColumnTest(di);

	// User
	emailColumnTest(di);
	passwordColumnTest(di);
	tempEmailColumnTest(di);
	usernameColumnTest(di);
}
