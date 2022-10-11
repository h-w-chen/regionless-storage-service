// ICN Interest Forwarder
const axios = require('axios');
const Interest = require('./interest');
const Routes = require('./routes').Store;

function parseInterest(interestKey) {
    const {name, revStart, revEnd} = interestKey.split(':');
    return new Interest(name, revStart, revEnd);
}

const InterestForwarder = class {
    constructor(routes) {
        this.routes = new Routes();
        routes.forEach(r => {
            this.routes.add(r);
        });
        this.routes.build();
    }

    forward(interestKey) {
        const interest = parseInterest(interestKey);
        const nextHop = this.getNextHop(interest);
        return this.sendInterest(nextHop, interest)
        .then((data) => {
            console.log(`interest message forwarded successfully: ${interestKey} to ${data}`);
            return Promise.resolve('sent ok');
        }).catch((err) => {
            // todo: retry by some means, e.g. with another destination?
            console.log(err);
        });
    }

    getNextHop(interest) {
        // todo: lookup routing table
        return "http://127.0.0.1:10101/interests";   //for local test purpose only
    }

    async sendInterest(node, interest) {
        return axios.post(node, interest);
    }
};

module.exports = InterestForwarder;
