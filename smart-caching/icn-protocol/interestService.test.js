const createInterestService = require('./interestService');
const testPIT = new Set();
const IRT = require('./irt');
const testIRT = new IRT();

const supertest = require('supertest');
const Interest = require('./interest');

describe('interest service', () => {
    beforeEach(() => {
        cb = jest.fn().mockResolvedValueOnce('resolved');
        testServer = createInterestService(testPIT, testIRT, cb);
    });

    describe('given an interest message', () => {
        it('should return 200 and ACK', async () => {
            const interest = new Interest('k', 1, 1);
            const {text, statusCode} = await supertest(testServer)
                .post('/interests')
                //.set('Content-Type', 'application/json')
                .send(interest);
            expect(statusCode).toBe(200);
            expect(text).toBe('interest received');
        });

        it('should put in pit, if not yet', async () => {
            const interest = new Interest('k', 1, 2);
            const pitMock = jest.spyOn(testPIT, 'add');
            await supertest(testServer)
                .post('/interests')
                .send(interest);
            expect(pitMock).toHaveBeenCalledWith('k:1:2');
            pitMock.mockRestore();
        });

        it('should enlist in irt', async () => {
            const interest = new Interest('k', 1, 3);
            const irtMock = jest.spyOn(testIRT, 'enlist');
            await supertest(testServer)
                .post('/interests')
                .send(interest);
            expect(irtMock).toHaveBeenCalledWith('k:1:3', '127.0.0.1');
            irtMock.mockRestore();
        });
    });
});
