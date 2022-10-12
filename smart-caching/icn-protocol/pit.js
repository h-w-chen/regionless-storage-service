// ICN Pending Interest Table
const InterestForwarder = require('./if');

const PIT = class extends Set {
    constructor(fib) {
        super();
        this.interestForwarder = new InterestForwarder(fib);
    }

    add(interest) {
        super.add(interest);
        return this.interestForwarder.forward(interest);
    }
};

module.exports = PIT;
