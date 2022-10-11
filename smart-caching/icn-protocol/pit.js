// ICN Pending Interest Table
const InterestForwarder = require('./if');

const PIT = class extends Set {
    constructor(routes) {
        super();
        this.interestForwarder = new InterestForwarder(routes);
    }

    add(interest) {
        super.add(interest);
        return this.interestForwarder.forward(interest);
    }
};

module.exports = PIT;
