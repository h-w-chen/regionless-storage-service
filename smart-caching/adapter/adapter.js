// smart caching adapter

// reading the setting

// prepare various components
const createInterestService = require('../icn-protocol/interestService');
const pit = new Set();
const IRT = require('../icn-protocol/irt');
const irt = new IRT();
const deadletters = new Set();

const RKVAgent = require('./rkvAgent');
rkvClient = new RKVAgent('http://127.0.0.1:8090/kv');

const createContentDispatcher = require('../icn-protocol/contentDispatcher');
contentDispatcher = createContentDispatcher();

const rkvPromiseOfInterest = (interest) => {
    return rkvClient.processInterest(interest)
        .then(async (content) => {
            // console.log('content:', content);
            const interestKey = interest.key();
            const nodes = Array.from(irt.list(interestKey));
            pit.delete(interestKey);
            resps = await contentDispatcher.sendContent(nodes, content);
            console.log('delivered results:', resps);
            resps.forEach((resp, index) => {
                if (resp.status === 200) {
                    irt.delist(interestKey, nodes[index]);
                } else {
                    console.log(`++++++ undelivered content to ${nodes[index]}`);
                    deadletters.add(content);
                    // todo: redeliver dead letters, if the future
                }
            });
        }).catch((e) => {
            console.error(`got runtime error while processing interest/content: ${e}`);
        });
};
const interestService = createInterestService(pit, irt, rkvPromiseOfInterest);

// start interest message service
const server = interestService.listen(10086, ()=>{
    console.log("adapter is listening on port 10086 for internal Interest messages");
});
