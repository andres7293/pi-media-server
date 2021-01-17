import Sqlite3 from '../db/Sqlite3';

const dbName: string = ":memory:";
const sqlite3: Sqlite3 = new Sqlite3(dbName);

beforeEach(async (done) => {
    const createTableSql: string = `
        CREATE TABLE IF NOT EXISTS users(
            userid INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            usermail TEXT
            ); `
    const insertRowSql: string = `
        INSERT INTO users(username, usermail) 
        VALUES("andres", "andres@mail.com");
    `;
    await sqlite3.run(createTableSql);
    await sqlite3.run(insertRowSql);
    await sqlite3.run(insertRowSql);
    done();
});

afterEach(async (done) => {
    await sqlite3.run("DROP TABLE users;");
    done();
});

test('test get all rows', async (done) => {
    const rows = await sqlite3.all(`SELECT * FROM users;`);
    if (rows === null)
        throw new Error('rows cant be null');
    expect(rows[0]).toEqual({userid: 1, usermail: 'andres@mail.com', username: 'andres'});
    expect(rows[1]).toEqual({userid: 2, usermail: 'andres@mail.com', username: 'andres'});
    done();
});

test('test bad sql statement should throw error', async (done) => {
    await expect( sqlite3.run('sdf' ))
        .rejects
        .toThrow();
    done();
});
