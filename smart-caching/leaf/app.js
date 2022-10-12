const express = require('express');
const app = express();

const Cache = require('./cache');
const cache = new Cache({max: maxCacheRecords || 1000000});

// R: kv?key=k&rev=r
app.get('/kv', async (req, resp) => {
    const key = req.query.key;
    const rev = req.query.rev;

    if (!key || !rev) {
        return resp.status(400).end("key and rev MUST be specified");
    }

    try{
        // todo: k-r may be illegal combination; handle that properly
        result = await cache.fetchKeyOfRev(key, rev);
        resp.status(result.code).end(result.value);
    } catch (e) {
        resp.status(500).end(`${e.message}`);
    }
});

module.exports = {app, cache};
