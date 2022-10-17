const express = require('express');
const bodyParser = require('body-parser');
const Interest = require('./interest');


const createInterestService = (pit, irt, genInterestPromise) => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/interests', (req, resp) => {
        const fromIP = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(':').pop();
        console.log(`>>>>>> interest from: ${fromIP}: `, req.body);
        const interest = Interest.FromObject(req.body);

        interestKey = interest.key();
        if (!pit.has(interestKey)){
            pit.add(interestKey);
            genInterestPromise(interest);
        }
        irt.enlist(interest.key(), fromIP);
        resp.status(200).end('interest received');
    });

    return app;
};


module.exports = createInterestService;
