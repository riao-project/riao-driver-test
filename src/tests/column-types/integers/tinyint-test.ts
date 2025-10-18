import 'jasmine';
import { ColumnType } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { integerTypesTests } from './integer-types-tests';

export const tinyintTest = (di: TestDependencies) =>
	integerTypesTests(di, ColumnType.TINYINT, 127);
