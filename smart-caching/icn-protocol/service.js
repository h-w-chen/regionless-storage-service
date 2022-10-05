// ICN service: accepts ICN content messages 

const express = require('express');
const icnService = express();
const {cache} = require('../leaf/app');

const bodyParser = require('body-parser');
icnService.use(bodyParser.json());
icnService.use(bodyParser.urlencoded({extended: true}));

icnService.post('/contents', (req, resp) => {
    console.log(">>>>", req.body);
    content = req.body;
    // todo: convert to Content type object
    k = `${content.name}:${content.revStart}`;
    console.log(">>>>", k);
    cache.setKeyOfRev(content.name, content.revStart, JSON.stringify(content.content));
    cache.emitter.emit(k);
    resp.status(200).end('received');
});

module.exports = icnService;
