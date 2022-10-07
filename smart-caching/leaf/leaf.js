const {app, cache} = require('./app');
const {icnService, controller} = require('../icn-protocol/service');
const config = require('config');

console.log(config);
console.log(config.get('ccn.route./'));

cache.setController(controller);

const server = app.listen(8091, () => {
    console.log("leaf is listening on port 8091 for rkv client requests.");
});

const icnServer = icnService.listen(10305, () => {
    console.log("leaf is listening on port 10305 for internal ICN content packets.");
});
