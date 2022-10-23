// ICN controller
// 1- on request, send Interest message if not yet;
// 2- on receipt of content, update cache and notify all pending requests.

const PIT = require('../icn-protocol/pit');

const Controller = class {
    constructor (cache, routeMaps) {
        this.pit = new PIT(routeMaps);
        this.cache = cache;
    }

    requestInterest(interest) {
        if (!this.pit.has(interest)){
            this.pit.add(interest);
        }
    }

    removeInterest(interest) {
        this.pit.delete(interest);
    }

    onContent(content) {
        content.contentStatic.forEach((c) => {
            this.cache.setKeyOfRev(content.name,
                c.rev,
                {code: c.code, value: c.value});
        });

        const interestKey = content.interestKey();
        if (this.pit.has(interestKey)) {
            this.cache.emitter.emit(interestKey);
        }
    }
};

function createController (cache, routeMaps) {
    return new Controller(cache, routeMaps);
}

module.exports = createController;
