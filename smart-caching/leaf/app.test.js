maxCacheRecords = 3;    // test setting
timeout = 2000;         // test setting

const {app, cache} = require('./app');
const supertest = require("supertest");

describe('leaf app http server', () => {
    describe('given populated cache', () => {
        beforeAll(() => {
            // test data
            cache.setKeyOfRev('k', 99, {code: 200, value: 'value of k-99'});
            cache.setKeyOfRev('k', 77, {code: 404});

            const ctrlFake = {
                requestInterest: jest.fn(),
                removeInterest: jest.fn(),
            };
            cache.setController(ctrlFake);
        });

        describe('given both key and rev query parameters', () => {
            it('GET /kv?key=k&rev=99 cache hit with regular outcome', async () => {
                resp = await supertest(app).get('/kv?key=k&rev=99');
                expect(resp.status).toBe(200);
                expect(resp.text).toEqual('value of k-99');
            });

            it('GET /kv?key=k&rev=99 cache hit with non-200 value', async () => {
                resp = await supertest(app).get('/kv?key=k&rev=77');
                expect(resp.status).toBe(404);
                expect(resp.text).toBe("");
            });

            it('GET /kv?key=k&rev=88 cache miss', async () => {
                resp = await supertest(app).get('/kv?key=k&rev=88');
                expect(resp.status).toBe(500);
                expect(resp.text).toEqual('timed out; not in cache yet');
            });
        });

        describe('not given both of key and rev', () => {
            it('should return 400 error', async () => {
                resp = await supertest(app).get('/kv?rev=88');
                expect(resp.status).toBe(400);
            });
        });
    });
});
