const express = require('express');
const app = express();

// R: kv?key=k&rev=r
app.get('/kv', (req, resp) => {
    key = req.query.key;
    rev = req.query.rev;

    if (!key || !rev) {
        return resp.status(400).end("key and rev MUST be specified");
    }

    return resp.send("hello");
});

// L: todo
// W: todo

const server = app.listen(8091, () => {
    console.log("leaf is listening on port 8091");
});
