const express = require('express');
const Interest = require('./interest');

const bodyParser = require('body-parser');

const createInterestService = () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/interests', (req, resp) => {
        console.log(">>>>", req.body);
        const interest = Interest.FromObject(req.body);
        //controller.OnContent(content);
        resp.status(200).end('interest received');
    });

    return app;
};


module.exports = createInterestService;
