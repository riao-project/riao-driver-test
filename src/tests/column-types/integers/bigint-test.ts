import 'jasmine';
import { ColumnType } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { integerTypesTests } from './integer-types-tests';

export const bigintTest = (di: TestDependencies) =>
	integerTypesTests(di, ColumnType.BIGINT, BigInt('9223372036854775807'));
