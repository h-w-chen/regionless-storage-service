const {app} = require('./app');
const icnService = require('../icn-protocol/service');

const server = app.listen(8091, () => {
    console.log("leaf is listening on port 8091 for rkv client requests.");
});

const icnServer = icnService.listen(10305, () => {
    console.log("leaf is listening on port 10305 for internal ICN content packets.");
});
