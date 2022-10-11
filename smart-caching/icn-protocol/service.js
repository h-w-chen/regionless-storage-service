// ICN service: accepts ICN content messages 

const Content = require('./content');

const express = require('express');
const icnService = express();

const {cache} = require('../leaf/app');
const Controller = require('./controller');
// todo: get icn routes setting
const controller = new Controller(cache, ['/'], {'/': ["127.0.0.1:9999"]});

const bodyParser = require('body-parser');
icnService.use(bodyParser.json());
icnService.use(bodyParser.urlencoded({extended: true}));

function toContentMessage(body) {
    return new Content(body.name, body.revStart, body.revEnd, body.contentStatic);
}

icnService.post('/contents', (req, resp) => {
    console.log(">>>>", req.body);
    let content = toContentMessage(req.body);
    controller.OnContent(content);
    resp.status(200).end('received');
});

module.exports = {icnService, controller};
