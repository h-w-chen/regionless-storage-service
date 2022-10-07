// ICN controller
// 1- on request, send Interest message if not yet;
// 2- on receipt of content, update cache and notify all pending requests.

const IRT = require('./irt')

const Controller = class {
    constructor (cache) {
        this.irt = new IRT();
        this.cache = cache;
    }

    RequestInterest(interest, sessionID) {
        this.irt.enlist(interest, sessionID);
        // todo: send out IM if not in PIT, in background?
        return sessionID;
    }

    RemoveInterest(interest, sessionID) {
        this.irt.delist(interest, sessionID);
    }

    OnContent(content) {
        this.cache.setKeyOfRev(content.name, content.revStart, JSON.parse(content.contentStatic));

        let interestKey = `${content.name}:${content.revStart}`;
        let sessions = this.irt.list(interestKey);
        if (!sessions) return;
        for (let sess of sessions) {
            console.log(`to notify ${sess}`);
            this.cache.emitter.emit(sess);
        }
    }
};

module.exports = Controller;
