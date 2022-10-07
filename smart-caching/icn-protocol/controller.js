// ICN controller
// 1- on request, send Interest message if not yet;
// 2- on receipt of content, update cache and notify all pending requests.

const IRT = require('./irt');
const PIT = require('./pit');

const Controller = class {
    constructor (cache) {
        this.irt = new IRT();
        this.pit = new PIT();
        this.cache = cache;
    }

    RequestInterest(interest, sessionID) {
        this.irt.enlist(interest, sessionID);
        if (!this.pit.has(interest)){
            this.pit.addInterest(interest);
        }
        return sessionID;
    }

    RemoveInterest(interest, sessionID) {
        this.irt.delist(interest, sessionID);
    }

    OnContent(content) {
        this.cache.setKeyOfRev(content.name, content.revStart, JSON.parse(content.contentStatic));

        let interestKey = `${content.name}:${content.revStart}`;
        let sessions = this.irt.list(interestKey);
        this.pit.delete(interestKey);
        if (!sessions) return;
        for (let sess of sessions) {
            console.log(`to notify ${sess}`);
            this.cache.emitter.emit(sess);
        }
    }
};

module.exports = Controller;
