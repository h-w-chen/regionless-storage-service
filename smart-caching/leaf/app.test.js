const app = require('./app');
const supertest = require("supertest");

it('GET /kv?key=k&rev=99', async () => {
    resp = await supertest(app).get('/kv?key=k&rev=99');
    expect(resp.status).toBe(200);
    expect(resp.text).toEqual('hello');
});
