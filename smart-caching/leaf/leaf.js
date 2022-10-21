// leaf setting
const config = require('config');
timeout = config.leaf.timeout;
maxCacheRecords = config.leaf.maxCacheRecords;
const portContent = config.icn.ports.content
const routes = config.ccn.route;
const routeMaps = new Map();
Object.keys(routes).forEach(r => routeMaps.set(r, config.ccn.route.get(r)));

console.log(`response timeout:     \t ${timeout} ms`);
console.log(`max records in cache: \t ${maxCacheRecords}`);
console.log(`content port:         \t ${portContent}`);
console.log('leaf routing table:   \t', routeMaps);
console.log('');

// prepare various components
const {app, cache} = require('./app');
const Controller = require('../icn-protocol/controller');
controller = new Controller(cache, routeMaps);

const createContentService = require('../icn-protocol/contentService');
const contentService = createContentService();

cache.setController(controller);

const server = app.listen(8090, () => {
    console.log("leaf is listening on port 8090 for rkv client requests.");
});

const contentServer = contentService.listen(portContent, () => {
    console.log(`leaf is listening on port ${portContent} for internal ICN content packets.`);
});
