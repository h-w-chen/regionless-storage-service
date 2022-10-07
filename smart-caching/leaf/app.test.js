const {app, cache} = require('./app');
const supertest = require("supertest");

beforeAll(() => {
    // test data
    cache.setKeyOfRev('k', 99, 'value of k-99');

    const ctrlFake = {
        RequestInterest: jest.fn(),
        RemoveInterest: jest.fn(),
    };
    cache.setController(ctrlFake);
});

it('GET /kv?key=k&rev=99 cache hit', async () => {
    resp = await supertest(app).get('/kv?key=k&rev=99');
    expect(resp.status).toBe(200);
    expect(resp.text).toEqual('value of k-99');
});

it('GET /kv?key=k&rev=88 cache miss', async () => {
    resp = await supertest(app).get('/kv?key=k&rev=88');
    expect(resp.status).toBe(500);
    expect(resp.text).toEqual('timed out; not in cache yet');
});
