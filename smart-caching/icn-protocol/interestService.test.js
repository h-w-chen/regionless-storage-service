const createInterestService = require('./interestService');
const testServer = createInterestService();

const supertest = require('supertest');
const Interest = require('./interest');

describe('adapter', () => {
    describe('given an interest message', () => {
        it('should return 200', async () => {
            const interest = new Interest('k', 1, 2);
            const result = await supertest(testServer)
                .post('/interests')
                //.set('Content-Type', 'application/json')
                .send(interest);
            expect(result.statusCode).toBe(200);
        });
    });
});
