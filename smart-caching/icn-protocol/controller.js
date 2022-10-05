// ICN controller
// 1- on request, send Interest message if not yet;
// 2- on receipt of content, update cache and notify all pending requests.

const IRT = require('./irt')

const Controller = class {
    constructor (cache) {
        this.irt = new IRT();
        this.cache = cache;
    }

    ReuestInterest(interest, sessionID) {
        this.irt.enlist(interest, sessionID);
        // todo: send out IM if not in PIT, in background?
    }

    OnContent(interest) {
        // todo: update cache
        let sessions = this.irt.list(interest);
        for (let sess of sessions) {
            console.log(`to notify ${sess}`);
            this.cache.emitter.emit(sess);
        }
    }
};

module.exports = Controller;
