// ICN Interest Forwarder

const Interest = require('./interest');

function parseInterest(interestKey) {
    const {name, revStart, revEnd} = interestKey.split(':');
    return new Interest(name, revStart, revEnd);
}

const InterestForwarder = class {
    forward(interestKey) {
        let interest = parseInterest(interestKey);
        this.sendInterest(this.getNextHop(interest), interest);
    }

    getNextHop(interest) {
        // todo: lookup routing table
        return "127.0.0.1:10101";   //for local test purpose only
    }

    sendInterest(node, interest) {
        // todo
    }
};

module.exports = InterestForwarder;
