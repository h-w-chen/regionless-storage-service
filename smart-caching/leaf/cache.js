const { EventEmitter, once } = require("events");

const uuid = require("uuid");

const withTimeout = async (millis, promise) => {
    let timer = null;
    const timeout = new Promise((resolve, reject) => {
        timer = setTimeout(
                () => reject(new Error(`timed out; not in cache yet`)),
                millis);
        return timer;
    });
    value = await Promise.race([promise, timeout]);
    clearTimeout(timer);
    return value;
};

const genCacheKey = (key, rev) => `${key}:${rev}`;

const LocalCache = class {
    constructor() {
        // todo: replace with a LRU cache
        this.kvstore = new Map();
        this.emitter = new EventEmitter();
        this.controller = null;
    }

    setController(controller) {
        this.controller = controller;
    }

    setKeyOfRev(key, rev, codeValue) {
        // assuming codeValue like {code: 200, value: "value of key of rev"}
        // for static content record
        this.kvstore.set(genCacheKey(key,rev), codeValue);
    }

    // test hook
    // returns the value that already in cache, or undefined otherwise
    getKeyOfRev(key, rev) {
        return this.kvstore.get(genCacheKey(key, rev));
    }

    async fetchKeyOfRev(key, rev) {
        const value = this.kvstore.get(genCacheKey(key, rev));
        if (value) {
            return value;
        }
    
        // request ICN controlelr with interest
        const sessionID = uuid.v4();
        const interestKey = `${key}:${rev}`;
        const regId = this.controller.RequestInterest(interestKey, sessionID);

        try{
            await withTimeout(3000, once(this.emitter, regId).then(() => 'lazy populated'));
            // now data should have been in the local store
            return this.getKeyOfRev(key, rev);
        } finally {
            this.controller.RemoveInterest(interestKey, regId);
        }
    }
};

module.exports = LocalCache;
