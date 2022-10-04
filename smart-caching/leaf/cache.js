const genCacheKey = (key, rev) => `${key}:${rev}`;

const LocalCache = class {
    constructor() {
        this.kvstore = new Map();
    }

    setKeyOfRev(key, rev, value) {
        this.kvstore.set(genCacheKey(key,rev), value);        
    }

    async fetchKeyOfRev(key, rev) {
        let value = this.kvstore.get(genCacheKey(key, rev));
        if (value) {
            return value;
        }
    
        // todo: wait for content message populating cache
        // for now simply reject it
        throw new Error('not in cache yet');
    }
};

module.exports = LocalCache;
