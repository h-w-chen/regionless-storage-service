const supertest = require('supertest');
const {icnService} = require('./service');
const {cache} = require('../leaf/app');

const Content = require('./content');

it('POST /contents should insert content in kv store', async () => {
    value = cache.getKeyOfRev('k', 1);
    expect(value).toBeUndefined();

    payload = {rev: 1, code: 201, value: 'val of k-1'};
    content = new Content('k', 1, 5, [payload]);
    await supertest(icnService)
        .post('/contents')
        .set('Content-type', 'application/json')
        .send(JSON.stringify(content))
        .expect(200)
        .expect(data => expect(data.text).toEqual('received'));
    value = cache.getKeyOfRev('k', 1);
    expect(value).toEqual({code: 201, value: 'val of k-1'});
});
