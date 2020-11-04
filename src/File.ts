import * as fs from 'fs';

class File {
    protected path: string;
    protected fname: string;
    protected absPath: string;

    constructor(path: string, fname?: string) {
        this.path = path;
        if (path[this.path.length - 1] !== '/') {
            this.path += '/';
        }
        if (fname) {
            this.fname = fname;
        } else {
            this.fname = '';
        }
        this.absPath = this.path + this.fname;
    }

    async write(data: Buffer | string): Promise<void> {
        return fs.promises.writeFile(this.absPath, data);
    }

    async createFile(fname: string, data: Buffer | string): Promise<void> {
        return fs.promises.writeFile(this.absPath + '/' + fname, data);
    }

    async createDir(): Promise<void> {
        await fs.promises.mkdir(this.absPath);
    }

    async delete(): Promise<boolean> {
        try {
            await fs.promises.unlink(this.absPath);
        } catch (error) {
            return false;
        }
        return true;
    }

    getFileName(): string {
        return this.fname;
    }

    getPath(): string {
        return this.path;
    }

    getAbsPath(): string {
        return this.path + this.fname;
    }

    async list(): Promise<File[]> {
        let flist: File[] = [];
        let fnames: string[] = await fs.promises.readdir(this.absPath);
        fnames.forEach((name) => {
            flist.push(new File(this.path, name));
        });
        return flist;
    }

    isFile(): boolean {
        return this.getStat().isFile();
    }

    isDirectory(): boolean {
        return this.getStat().isDirectory();
    }

    exists(): boolean {
        return fs.existsSync(this.absPath);
    }

    toString(): string {
        return this.absPath;
    }

    private getStat(): any {
        return fs.statSync(this.absPath);
    }
}

export { File }
