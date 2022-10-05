const supertest = require('supertest');
const icnService = require('./service');

const Content = require('./content');

// afterAll(() => {
//     icnService.close();
// });

test('POST /contents should be accepted', async () => {
    payload = { value: 'val of k-1'};
    content = new Content('k', 1, 5, payload);
    await supertest(icnService)
        .post('/contents')
        .send(JSON.stringify(content))
        .expect(200)
        .expect(data => expect(data.text).toEqual('received'));
});
