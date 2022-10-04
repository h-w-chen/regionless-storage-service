const {localCache, fetchKeyOfRev, genCacheKey } = require('./cache');

// test data
localCache.set(genCacheKey("a", 1), 'a-1 val');

it('cache hit', async ()=>{
    let v = await fetchKeyOfRev('a', 1);
    expect(v).toBe('a-1 val');
});

it('cache miss', async ()=>{
    try{
        let v = await fetchKeyOfRev('b', 1);
    } catch (e) {
        expect(e).toEqual(Error('not in cache yet'));
    }
});