// smart caching adapter
const createInterestService = require('../icn-protocol/interestService');
const interestService = createInterestService();

// reading the setting

// prepare various components

// start interest message service
const server = interestService.listen(10086, ()=>{
    console.log("adapter is listening on port 10086 for internal Interest messages");
});
