// ICN Pending Interest Table
const InterestForwarder = require('./if');

const PIT = class extends Set {
    constructor(routes, routeMaps) {
        super();
        this.interestForwarder = new InterestForwarder(routes, routeMaps);
    }

    add(interest) {
        super.add(interest);
        return this.interestForwarder.forward(interest);
    }
};

module.exports = PIT;
