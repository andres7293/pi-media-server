import sqlite3 from 'sqlite3';

class Sqlite3 {
    private dbName: string;
    private db: sqlite3.Database;

    constructor(dbName: string) {
        this.dbName = dbName;
        this.db = new sqlite3.Database(this.dbName);
    }

    public run(sql: string, params?: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (error: Error) => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }

    public all(sql: string, params?: any): Promise<null | any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (error: Error | null, rows: null | any[]) => {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            });
        });
    }

    public get(sql: string, params?: any): Promise<null | any> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (error: Error | null, row: any | null) => {
                if (error)
                    reject(error);
                else
                    resolve(row);
            });
        });
    }
}

export = Sqlite3;
