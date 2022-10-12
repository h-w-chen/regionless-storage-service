// leaf setting
const config = require('config');
console.log(config);
routes = config.get('ccn.route');
routeMaps = new Map();
Object.keys(routes).forEach(r => routeMaps.set(r, config.get(`ccn.route.${r}`)));
console.log('leaf routing table is ', routeMaps);

// prepare various components
const {app, cache} = require('./app');
const Controller = require('../icn-protocol/controller');
// todo: get icn routes setting
controller = new Controller(cache, Object.keys(routes), routeMaps);

const {icnService} = require('../icn-protocol/service');


console.log(config.get('ccn.route./'));

cache.setController(controller);

const server = app.listen(8091, () => {
    console.log("leaf is listening on port 8091 for rkv client requests.");
});

const icnServer = icnService.listen(10305, () => {
    console.log("leaf is listening on port 10305 for internal ICN content packets.");
});
