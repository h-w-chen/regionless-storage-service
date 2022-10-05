const { EventEmitter } = require("events");

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
        this.kvstore = new Map();
        this.emitter = new EventEmitter();
    }

    setKeyOfRev(key, rev, value) {
        this.kvstore.set(genCacheKey(key,rev), value);        
    }

    async fetchKeyOfRev(key, rev) {
        let value = this.kvstore.get(genCacheKey(key, rev));
        if (value) {
            return value;
        }
    
        // waiting for the event of content message populating cache
        // refer to https://stackoverflow.com/questions/52608191/can-you-replace-events-with-promises-in-nodejs
        const Future = fn => {return new Promise((r,t) => fn(r,t) )};
        // define an eventFn that takes a promise `resolver`
        const eventFn = (resolve, t) => {
            this.emitter.on(genCacheKey(key, rev), () => {
                // the event just happened; assumed that local cache has been populated
                // to look up local cache again; should found {k-r, v}
                // todo: to impl
                resolve('lazy populated; to impl');
            });
        };
        // invoke eventFn in an `async` workflowFn using `Future` to obtain a `promise` wrapper
        const workflowFn = async () => await Future(eventFn);
        let content = await withTimeout(3000, workflowFn());
        return content;
    }
};

module.exports = LocalCache;
