// ICN Interest Forwarder
const axios = require('axios');
const Interest = require('./interest');

function parseInterest(interestKey) {
    const {name, revStart, revEnd} = interestKey.split(':');
    return new Interest(name, revStart, revEnd);
}

const InterestForwarder = class {
    forward(interestKey) {
        let interest = parseInterest(interestKey);
        let nextHop = this.getNextHop(interest);
        return this.sendInterest(nextHop, interest)
        .then(() => {})
        .catch((err) => {
                // todo: retry with another destination?
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
