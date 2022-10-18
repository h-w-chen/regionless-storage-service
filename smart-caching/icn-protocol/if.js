// ICN Interest Forwarder
const axios = require('axios');
const Interest = require('./interest');
const Routes = require('./routes').Store;

// extract and normalize interest name from synthesized key
function parseInterest(interestKey) {
    const arr = interestKey.split(':');
    if (!arr[0].startsWith('/')) {
        arr[0] = `/${arr[0]}`;
    };
    return new Interest(arr[0], arr[1], arr[2]);
}

const InterestForwarder = class {
    constructor(fib) {
        this.routes = new Routes();
        [...fib.keys()].forEach(r => {
            this.routes.add(r);
        });
        this.routes.build();
        this.fib = fib;
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

    // identify the next hop based on icn routing table
    getNextHop(interest) {
        // todo: lookup routing table
        const nextHopRoute = this.routes.findLPM(interest.name);
        const nextHopDestination = this.fib.get(nextHopRoute)[0];
        return`http://${nextHopDestination}/interests`;
    }

    async sendInterest(url, interest) {
        return axios.post(url, interest);
    }
};

const createIF = (fib) => {
    return new InterestForwarder(fib);
};

module.exports = createIF;
