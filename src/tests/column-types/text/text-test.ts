import 'jasmine';
import { ColumnType } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { textTypesTests } from './text-types-tests';

export const textTest = (di: TestDependencies) =>
	textTypesTests(di, ColumnType.TEXT, 65535);
