const express = require('express');
const bodyParser = require('body-parser');
const Interest = require('./interest');


const createInterestService = (pit, irt) => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/interests', (req, resp) => {
        const fromIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(`from: ${fromIP}  >>>> ${req.body}`);
        const interest = Interest.FromObject(req.body);

        interestKey = interest.key();
        if (!pit.has(interestKey)){
            pit.add(interestKey);
            // todo: promise rkv client does the job
            // new Promise((resolve)=>{
            //     setTimeout( () => {
            //         console.log('delayed action taken');
            //         resolve('xxxxx');}, 5000);
            // });
        }
        irt.enlist(interest.key(), fromIP);
        resp.status(200).end('interest received');
    });

    return app;
};


module.exports = createInterestService;
