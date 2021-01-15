import express from 'express';
import { PageViewCache } from '../PageViewCache';

function pageViewCounter() {
    const cache = new PageViewCache();
    return function(req: express.Request, res: express.Response, next: express.NextFunction) {
        cache.add(req.originalUrl);
        if (req.body === undefined)
            req.body = {};
        req.body.pageViewCache = cache.getCache();
        next();
    }
}

export = pageViewCounter;
