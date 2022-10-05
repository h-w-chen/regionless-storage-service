const supertest = require('supertest');
const icnService = require('./service');
const {cache} = require('../leaf/app');

const Content = require('./content');

it('POST /contents should insert content in kv store and notify', async () => {
    value = cache.getKeyOfRev('k', 1);
    expect(value).toBeUndefined();

    const spy = jest.spyOn(cache.emitter, 'emit');

    payload = { value: 'val of k-1'};
    content = new Content('k', 1, 5, payload);
    await supertest(icnService)
        .post('/contents')
        .set('Content-type', 'application/json')
        .send(JSON.stringify(content))
        .expect(200)
        .expect(data => expect(data.text).toEqual('received'));
    value = await cache.getKeyOfRev('k', 1);
    expect(value).toBe(JSON.stringify(payload));
    expect(spy).toHaveBeenCalledWith('k:1');
});
