import { constants } from 'buffer';
import * as fs from 'fs';
import { File, FileError } from '../File';

const testDir = '/tmp/pi-media-server-test';
const testFile = 'testFile.txt';

beforeAll(async () => {
    await fs.promises.mkdir(testDir);
    await fs.promises.open(testDir + '/' + testFile, 'w');
});

afterAll(async () => {
    await fs.promises.rmdir(testDir, { recursive: true });
});

test('test file construction with path and filename', async (done) => {
    let f: File = new File('/home/username', 'config');
    expect(f.getPath()).toEqual('/home/username/');
    expect(f.getFileName()).toEqual('config');
    expect(f.getAbsPath()).toEqual('/home/username/config');
    done();
});

test('test file construction with path only', async (done) => {
    let f: File = new File('/home/username');
    expect(f.getPath()).toEqual('/home/username/');
    expect(f.getFileName()).toEqual('');
    expect(f.getAbsPath()).toEqual('/home/username/');
    done();
});

test('check if exists of directory returns true', (done) => {
    let dirExists: File = new File(testDir);
    expect(dirExists.exists()).toBeTruthy();
    done();
});

test('check if unexistence of directory returns false', (done) => {
    let dirNotExists: File = new File(testDir, 'dfsdf');
    expect(dirNotExists.exists()).toBeFalsy();
    done();
});

test('check if isDirectory throws an error when file doesnt exists', (done) => {
    const fileNotExists: File = new File('filedoesntexists');
    expect(fileNotExists.isDirectory).toThrow();
    done();
});

test('check if isFile returns true when file exists', (done) => {
    const file: File = new File(testDir, testFile);
    expect(file.isFile()).toBeTruthy();
    done();
});

test('check isFile throws an error when file doesnt exists', (done) => {
    const file: File = new File(testDir, 'filedoesntexists');
    expect(file.isFile).toThrow();
    done();
});

test('check if createDir creates a directory', async (done) => {
    const dir: File = new File(testDir + '/newDir');
    await dir.createDir();
    const dirExists: boolean = fs.existsSync(testDir + '/newDir');
    expect(dirExists).toBeTruthy();
    done();
});

test('check if write creates a file', async (done) => {
    const file: File = new File(testDir, 'newF.txt');
    await file.write('');
    const fileExists: boolean = fs.existsSync(testDir + '/newF.txt');
    expect(fileExists).toBeTruthy();
    done();
});

test('check if write writes correct data to file', async (done) => {
    const textToWrite = 'hello world';
    const file: File = new File(testDir, 'newF');
    await file.write(textToWrite);
    let textRead: Buffer = await fs.promises.readFile(testDir + '/' + 'newF');
    expect(textRead.toString()).toMatch(textToWrite);
    done();
});
