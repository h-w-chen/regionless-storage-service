// ICN service: accepts ICN content messages 

const express = require('express');
const icnService = express();

const {cache} = require('../leaf/app');
const Controller = require('./controller');
const controller = new Controller(cache);

const bodyParser = require('body-parser');
icnService.use(bodyParser.json());
icnService.use(bodyParser.urlencoded({extended: true}));

icnService.post('/contents', (req, resp) => {
    console.log(">>>>", req.body);
    content = req.body;
    // todo: convert to Content type object?
    controller.OnContent(content);
    resp.status(200).end('received');
});

module.exports = {icnService, controller};
