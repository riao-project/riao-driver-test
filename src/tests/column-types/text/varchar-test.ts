import 'jasmine';
import { ColumnType } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { textTypesTests } from './text-types-tests';

export const varcharTest = (di: TestDependencies) =>
	textTypesTests(di, ColumnType.VARCHAR, 8000);
