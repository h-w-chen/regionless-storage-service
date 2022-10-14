// smart caching adapter
const createInterestService = require('../icn-protocol/interestService');
const pit = new Set();
const IRT = require('../icn-protocol/irt');
const irt = new IRT();
const interestService = createInterestService(pit, irt);

// reading the setting

// prepare various components

// start interest message service
const server = interestService.listen(10086, ()=>{
    console.log("adapter is listening on port 10086 for internal Interest messages");
});
