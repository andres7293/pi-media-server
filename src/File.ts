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

    getFileName(): string {
        return this.fname;
    }

    getPath(): string {
        return this.path;
    }

    getAbsPath(): string {
        return this.path + this.fname;
    }

    async write(data: Buffer | string, fileName?: string): Promise<void> {
        let path: string = '';
        if (fileName !== undefined) {
            path = this.absPath + '/' + fileName;
        } else {
            path = this.absPath;
        }
        return fs.promises.writeFile(path, data);
    }

    async createDir(): Promise<void> {
        await fs.promises.mkdir(this.absPath);
    }

    async delete(): Promise<boolean> {
        await fs.promises.unlink(this.absPath);
        return true;
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
        try {
            return fs.statSync(this.absPath);
        } catch(error) {
            throw new FileError(error.message.toString());
        }
    }
}

class FileError extends Error {
    public name: string;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export { File, FileError }