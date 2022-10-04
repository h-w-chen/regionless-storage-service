const express = require('express');
const app = express();
const {fetchKeyOfRev} = require('./cache');

// R: kv?key=k&rev=r
app.get('/kv', async (req, resp) => {
    key = req.query.key;
    rev = req.query.rev;

    if (!key || !rev) {
        return resp.status(400).end("key and rev MUST be specified");
    }

    result = await fetchKeyOfRev(key, rev);
    resp.end(result);
});

module.exports = app;
