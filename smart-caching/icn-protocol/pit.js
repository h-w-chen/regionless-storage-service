// ICN Pending Interest Table
const InterestForwarder = require('./if');
const interestForwarder = new InterestForwarder();

const PIT = class extends Set {
    constructor() {
        super();
        this.interestForwarder = interestForwarder;
    }

    add(interest) {
        super.add(interest);
        return this.interestForwarder.forward(interest);
    }
};

module.exports = PIT;
