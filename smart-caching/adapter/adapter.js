// smart caching adapter

// reading the setting
const config = require('config');
console.log(`rkv base url:        \t ${config.rkv.baseURL}`);
console.log(`interest port:       \t ${config.icn.ports.interest}`);
console.log(`content port:        \t ${config.icn.ports.content}`);
console.log(`redelivery cron spec:\t ${config.cron.redeliveryTime}`);
console.log('')

const portInterest = config.icn.ports.interest
const portContent = config.icn.ports.content

// prepare various components
const createInterestService = require('../icn-protocol/interestService');
const pit = new Set();
const IRT = require('../icn-protocol/irt');
const irt = new IRT();
const deadletters = new Set();

const RKVAgent = require('./rkvAgent');
rkvClient = new RKVAgent(config.rkv.baseURL);

const createContentDispatcher = require('../icn-protocol/contentDispatcher');
contentDispatcher = createContentDispatcher(portContent);

const rkvPromiseOfInterest = (interest) => {
    return rkvClient.processInterest(interest)
        .then(async (content) => {
            // keep comment line below for troubleshooting turning-on
            // console.log('content:', content);
            const interestKey = interest.key();
            const nodes = Array.from(irt.list(interestKey));
            pit.delete(interestKey);
            resps = await contentDispatcher.sendContent(nodes, content);
            // keep comment line below for troubleshooting turning-on
            // console.log('delivered results:', resps);
            resps.forEach((resp, index) => {
                if (resp.status === 200) {
                    irt.delist(interestKey, nodes[index]);
                } else {
                    console.log(`++++++ undelivered content to ${nodes[index]}`);
                    deadletters.add(content);
                }
            });
        }).catch((e) => {
            console.error(`got runtime error while processing interest/content: ${e}`);
        });
};
const interestService = createInterestService(pit, irt, rkvPromiseOfInterest);

// start interest message service
const server = interestService.listen(portInterest, () => {
    console.log(`adapter is listening on port ${portInterest} for internal Interest messages`);
});

const { CronJob } = require('cron');
const deadletterDelivery = new CronJob(
    config.cron.redeliveryTime,
    () => contentDispatcher.attemptOnDeadLetters(deadletters, irt),
    null,
    true
);
