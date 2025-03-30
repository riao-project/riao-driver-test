import 'jasmine';
import { TestDependencies } from '../../dependency-injection';
import { updateTimestampTrigger } from './prebuilt/update-timestamp-trigger';

export function triggersTest(di: TestDependencies) {
	updateTimestampTrigger(di);
}
