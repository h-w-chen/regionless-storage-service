const app = require('./app');
const supertest = require("supertest");
const {localCache, genCacheKey} = require('./cache');

// test data
localCache.set(genCacheKey('k', 99), 'value of k-99');

it('GET /kv?key=k&rev=99 cache hit', async () => {
    resp = await supertest(app).get('/kv?key=k&rev=99');
    expect(resp.status).toBe(200);
    expect(resp.text).toEqual('value of k-99');
});

it('GET /kv?key=k&rev=88 cache miss', async () => {
    resp = await supertest(app).get('/kv?key=k&rev=88');
    expect(resp.status).toBe(500);
    expect(resp.text).toEqual('not in cache yet');
});
