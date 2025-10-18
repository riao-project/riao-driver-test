import 'jasmine';
import { ColumnType } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { textTypesTests } from './text-types-tests';

export const charTest = (di: TestDependencies) =>
	textTypesTests(di, ColumnType.CHAR, 1);
