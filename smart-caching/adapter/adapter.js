// smart caching adapter

// reading the setting

// prepare various components
const createInterestService = require('../icn-protocol/interestService');
const pit = new Set();
const IRT = require('../icn-protocol/irt');
const irt = new IRT();

const RKVAgent = require('./rkvAgent');
rkvClient = new RKVAgent('http://127.0.0.1:8090/kv');

const createContentDispatcher = require('../icn-protocol/contentDispatcher');
contentDispatcher = createContentDispatcher();

const rkvPromiseOfInterest = async (interest) => {
    return rkvClient.processInterest(interest)
        .then((content) => {
            // console.log('content:', content);
            const nodes = irt.list(interest.key());
            pit.delete(interest.key());
            irt.delete(interest.key());
            return contentDispatcher.sendContent(nodes, content);
        }).catch((e) => {
            console.error(`got runtime error while processing interest/content: ${e}`);
        });
};
const interestService = createInterestService(pit, irt, rkvPromiseOfInterest);

// start interest message service
const server = interestService.listen(10086, ()=>{
    console.log("adapter is listening on port 10086 for internal Interest messages");
});
