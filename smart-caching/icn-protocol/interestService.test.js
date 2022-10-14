const createInterestService = require('./interestService');
const testPIT = new Set();
const IRT = require('./irt');
const testIRT = new IRT();
const testServer = createInterestService(testPIT, testIRT);

const supertest = require('supertest');
const Interest = require('./interest');

describe('adapter', () => {
    describe('given an interest message', () => {
        it('should return 200 and ACK', async () => {
            const interest = new Interest('k', 1, 2);
            const {text, statusCode} = await supertest(testServer)
                .post('/interests')
                //.set('Content-Type', 'application/json')
                .send(interest);
            expect(statusCode).toBe(200);
            expect(text).toBe('interest received');
        });

        it('should put in pit, if not yet', async () => {
            const interest = new Interest('k', 1, 2);
            await supertest(testServer)
                .post('/interests')
                .send(interest);
            expect(testPIT.has('k:1:2')).toBeTruthy();
        });

        it('should enlist in irt', async () => {
            const interest = new Interest('k', 1, 2);
            await supertest(testServer)
                .post('/interests')
                .send(interest);
            expect(testIRT.list('k:1:2')).toEqual(new Set().add('::ffff:127.0.0.1'));
        });
    });
});
