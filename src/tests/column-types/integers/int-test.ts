import 'jasmine';
import { ColumnType } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { integerTypesTests } from './integer-types-tests';

export const intTest = (di: TestDependencies) =>
	integerTypesTests(di, ColumnType.INT, 2147483647);
