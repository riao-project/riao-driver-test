import 'jasmine';
import {
	columnName,
	ColumnType,
	Database,
	DatabaseRecord,
	QueryRepository,
} from 'riao-dbal/src';
import { TestDependencies } from '../dependency-injection';

interface User {
	id: number;
	fname: string;
}

interface Post {
	id: number;
	user_id: number;
	title: string;
}

type PostWithUser = User & Post;

export const dmlJoinTest = (di: TestDependencies) =>
	describe('Join find()', () => {
		let db: Database;
		let users: QueryRepository<User>;
		let posts: QueryRepository<Post>;

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: 'join_users_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'fname',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});

			await db.ddl.createTable({
				name: 'join_posts_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'user_id',
						type: ColumnType.BIGINT,
					},
					{
						name: 'title',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});

			await db.ddl.addForeignKey({
				table: 'join_posts_test',
				columns: ['user_id'],
				referencesTable: 'join_users_test',
				referencesColumns: ['id'],
			});

			users = db.getQueryRepository<User>({
				table: 'join_users_test',
			});

			posts = db.getQueryRepository<Post>({
				table: 'join_posts_test',
			});

			await users.insert({
				records: [{ fname: 'Bob' }, { fname: 'Tom' }],
			});

			await posts.insert({
				records: [
					{
						user_id: 1,
						title: 'Story of Bob',
					},
					{
						user_id: 1,
						title: 'Bob\'s Day',
					},
					{
						user_id: 2,
						title: 'Story of Tom',
					},
					{
						user_id: 2,
						title: 'Tom\'s Day',
					},
				],
			});
		});

		it('can left join', async () => {
			const results = <PostWithUser[]>await posts.find({
				columns: <any>[
					'join_posts_test.id as id',
					'join_posts_test.title as title',
					'join_users_test.fname as fname',
				],
				join: [
					{
						table: 'join_users_test',
						on: {
							'join_users_test.id': columnName(
								'join_posts_test.user_id'
							),
						},
					},
				],
				where: <DatabaseRecord>{
					'join_users_test.fname': 'Bob',
				},
			});

			expect(results.length).toEqual(2);
			expect(+results[0].id).toEqual(1);
			expect(results[0].title).toEqual('Story of Bob');
			expect(results[0].fname).toEqual('Bob');
		});
	});
