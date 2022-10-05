// ICN service: accepts ICN content messages 

const express = require('express');
const icnService = express();
const {cache} = require('../leaf/app');

const bodyParser = require('body-parser');
icnService.use(bodyParser.json());
icnService.use(bodyParser.urlencoded({extended: true}));

icnService.post('/contents', (req, resp) => {
    console.log(">>>>", req.body);
    resp.status(200).end('received');
});

module.exports = icnService;
