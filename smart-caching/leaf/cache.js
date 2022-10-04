const localCache = new Map();
const genCacheKey = (key, rev) => `${key}:${rev}`;


fetchKeyOfRev = async (key, rev) => {
    let combinedKey = genCacheKey(key, rev);
    let value = localCache.get(combinedKey);
    if (value) {
        return value;
    }

    // todo: wait for content message populating cache
    // for now simply reject it
    //throw new Error('not in cache yet');
    return 'hello';
}

module.exports = { fetchKeyOfRev, localCache, genCacheKey };
