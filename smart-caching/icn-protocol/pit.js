// ICN Pending Interest Table
const createIF = require('./if');

const PIT = class extends Set {
    constructor(fib) {
        super();
        this.interestForwarder = createIF(fib);
    }

    add(interest) {
        super.add(interest);
        return this.interestForwarder.forward(interest);
    }
};

module.exports = PIT;
