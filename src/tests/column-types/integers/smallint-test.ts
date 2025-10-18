import 'jasmine';
import { ColumnType } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { integerTypesTests } from './integer-types-tests';

export const smallintTest = (di: TestDependencies) =>
	integerTypesTests(di, ColumnType.SMALLINT, 32767);
