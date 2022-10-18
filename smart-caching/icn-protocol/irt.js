// IRT: interest-request-table
// each interest have one or more request sessions
const IRT = class {
    constructor() {
        this.interests = new Map();
    }

    // register a client request to specific interest
    enlist(interest, idReq) {
        if (!this.interests.has(interest)) {
            this.interests.set(interest, new Set().add(idReq));
        } else {
            this.interests.get(interest).add(idReq);            
        }
    }

    // unregister a client request from specific interest
    delist(interest, idReq) {
        let reqs = this.interests.get(interest);
        if (!reqs) {
            return;            
        }

        reqs.delete(idReq);
        if (reqs.size === 0) {
            this.interests.delete(interest);
        }
    }

    // delete all registered to a specific interest
    delete(interest) {
        this.interests.delete(interest);
    }

    // get enlisted requests of a given interest
    list(interest) {
        return this.interests.get(interest);
    }
};

module.exports = IRT;
