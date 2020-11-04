import express from 'express';
import { File } from './File';
import { getConfig, IConfig } from './config';
import * as bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const config: IConfig = getConfig();

const PORT: number = config.PORT;
const MEDIA_SERVER_DIR: string = config.MEDIA_SERVER_DIR;
const app = express();

app.use(express.static(MEDIA_SERVER_DIR));

function encodePathToUri(req: express.Request, file: string): string {
    return req.protocol + '://' + req.hostname + ':' + String(PORT) + req.baseUrl + '/' + encodeURIComponent(file);
}

async function generatePlaylist(req: express.Request, dir: File, shuffle: boolean = false): Promise<string> {
    let fileList: File[] = await dir.list();
    if (shuffle) {
        fileList.sort(() => Math.random() - 0.5);
    }
    let playlist: string = '';
    fileList.forEach((file) => {
        playlist += encodePathToUri(req, file.getFileName()) + '\n';
    });
    return playlist;
}

app.get('/playlist', async (req: express.Request, res: express.Response) => {
    const rootDir: File = new File(MEDIA_SERVER_DIR);
    let playlist: string = await generatePlaylist(req, rootDir);
    await rootDir.createFile('playlist.m3u', playlist);
    res.redirect(301, encodePathToUri(req, '/playlist.m3u'));
    res.end();
});

app.get('/random', async (req: express.Request, res: express.Response) => {
    const rootDir: File = new File(MEDIA_SERVER_DIR);
    let playlist: string = await generatePlaylist(req, rootDir, true);
    await rootDir.createFile('random.m3u', playlist);
    res.redirect(301, encodePathToUri(req, '/random.m3u'));
    res.end();
});

app.delete('/', bodyParser.text(), async (req: express.Request, res: express.Response) => {
    let fname: string = req.body;
    let f = new File(MEDIA_SERVER_DIR + fname);
    let success: boolean = await f.delete();
    if (success) {
        res.status(200).send(fname + ' removed');
    } else {
        res.status(400).send('error removing ' + fname);
    }
});

app.listen(PORT, () => {
    console.log('server started at, ', PORT);
});