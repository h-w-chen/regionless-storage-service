// smart caching adapter
const createInterestService = require('../icn-protocol/interestService');
const pit = new Set();
const IRT = require('../icn-protocol/irt');
const irt = new IRT();

const RKVAgent = require('./rkvAgent');
rkvClient = new RKVAgent('http://127.0.0.1:8090/kv');

const rkvPromiseOfInterest = async (interest) => {
    return rkvClient.processInterest(interest)
        .then((content) => {
            console.log('content:', content);
            // todo: process received content
        }).catch((e) => {
            console.log('some response has error', e);
        });
};
const interestService = createInterestService(pit, irt, rkvPromiseOfInterest);

// reading the setting

// prepare various components

// start interest message service
const server = interestService.listen(10086, ()=>{
    console.log("adapter is listening on port 10086 for internal Interest messages");
});
