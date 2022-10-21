// ICN service: accepts ICN content messages 

const Content = require('./content');
const express = require('express');

const createContentService = () => {
    const contentService = express();

    const bodyParser = require('body-parser');
    contentService.use(bodyParser.json());
    contentService.use(bodyParser.urlencoded({extended: true}));

    function toContentMessage(body) {
        return new Content(body.name, body.revStart, body.revEnd, body.contentStatic);
    }

    contentService.post('/contents', (req, resp) => {
        console.log(">>>>", req.body);
        const content = toContentMessage(req.body);
        controller.OnContent(content);
        resp.status(200).end('received');
    });

    return contentService;
};

module.exports = createContentService;
