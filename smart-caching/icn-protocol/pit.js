// ICN Pending Interest Table
const InterestForwarder = require('./if');
const interestForwarder = new InterestForwarder();

function parseInterest(interestKey) {
    const {name, revStart, revEnd} = interestKey.split(':');
    return {name: name, revStart: revStart, revEnd: revEnd};
}

const PIT = class extends Set {
    constructor() {
        super();
        this.interestForwarder = interestForwarder;
    }

    addInterest(interest) {
        super.add(interest);
        // todo: send out IM if not in PIT, in background?
        this.interestForwarder.forward(interest);
    }
};

module.exports = PIT;
