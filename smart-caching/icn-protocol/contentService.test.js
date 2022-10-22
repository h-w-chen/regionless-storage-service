maxCacheRecords = 3;    // test setting

const supertest = require('supertest');

const createContentService = require('./contentService');
const contentService = createContentService();

const {cache} = require('../leaf/app');
const createController = require('../leaf/controller');
controller = createController(cache, new Map([['/', ['1.2.3.4']]]));

const Content = require('./content');

it('POST /contents should insert content in kv store', async () => {
    value = cache.getKeyOfRev('k', 1);
    expect(value).toBeUndefined();

    payload = {rev: 1, code: 201, value: 'val of k-1'};
    content = new Content('k', 1, 5, [payload]);
    await supertest(contentService)
        .post('/contents')
        .set('Content-type', 'application/json')
        .send(JSON.stringify(content))
        .expect(200)
        .expect(data => expect(data.text).toEqual('received'));
    value = cache.getKeyOfRev('k', 1);
    expect(value).toEqual({code: 201, value: 'val of k-1'});
});
