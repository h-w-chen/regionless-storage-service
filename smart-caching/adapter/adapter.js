// smart caching adapter
const interestService = require('../icn-protocol/interestService');

// reading the setting

// prepare various components

// start interest message service
const server = interestService.listen(10086, ()=>{
    console.log("adapter is listening on port 10086 for internal Interest messages");
});
