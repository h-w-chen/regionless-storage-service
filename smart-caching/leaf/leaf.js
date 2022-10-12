// leaf setting
const config = require('config');
timeout = config.get('leaf.timeout');
console.log(`response timeout: \t ${timeout} ms`);
maxCacheRecords = config.get('leaf.maxCacheRecords');
console.log(`max records in cache: \t ${maxCacheRecords}`);
const routes = config.get('ccn.route');
const routeMaps = new Map();
Object.keys(routes).forEach(r => routeMaps.set(r, config.get(`ccn.route.${r}`)));
console.log('leaf routing table: \t', routeMaps);

// prepare various components
const {app, cache} = require('./app');
const Controller = require('../icn-protocol/controller');
controller = new Controller(cache, routeMaps);

const {icnService} = require('../icn-protocol/service');

cache.setController(controller);

const server = app.listen(8091, () => {
    console.log("leaf is listening on port 8091 for rkv client requests.");
});

const icnServer = icnService.listen(10305, () => {
    console.log("leaf is listening on port 10305 for internal ICN content packets.");
});
