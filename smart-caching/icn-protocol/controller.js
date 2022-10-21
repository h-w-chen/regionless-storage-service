// ICN controller
// 1- on request, send Interest message if not yet;
// 2- on receipt of content, update cache and notify all pending requests.

const IRT = require('./irt');
const PIT = require('./pit');

const Controller = class {
    constructor (cache, routes, routeMaps) {
        this.irt = new IRT();
        this.pit = new PIT(routes, routeMaps);
        this.cache = cache;
    }

    requestInterest(interest, sessionID) {
        this.irt.enlist(interest, sessionID);
        if (!this.pit.has(interest)){
            this.pit.add(interest);
        }
        return sessionID;
    }

    removeInterest(interest, sessionID) {
        this.irt.delist(interest, sessionID);
    }

    onContent(content) {
        content.contentStatic.forEach((c) => {
            this.cache.setKeyOfRev(content.name,
                c.rev,
                {code: c.code, value: c.value});
        });

        const interestKey = `${content.name}:${content.revStart}`;
        const sessions = this.irt.list(interestKey);
        this.pit.delete(interestKey);
        if (!sessions) return;
        for (let sess of sessions) {
            console.log(`to notify ${sess}`);
            this.cache.emitter.emit(sess);
        }
    }
};

module.exports = Controller;
