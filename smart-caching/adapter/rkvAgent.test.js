const Interest = require('../icn-protocol/interest');
const RKVAgent = require('./rkvAgent');

//jest.mock('axios');
const axios = require('axios');

describe('rkv agant', () => {
    describe('given an interest', () => {
        it('should send out various rkv requests', async () => {
            jest.spyOn(axios, 'create').mockImplementation(() =>  axios);
            jest.spyOn(axios, 'get').mockResolvedValueOnce('dummy1').mockResolvedValueOnce('dummy2');
            const testAgant = new RKVAgent('http://127.0.0.1:8090/kv');

            const interest = new Interest('k', 1, 2);
            const content = await testAgant.request(interest);
            expect(content).toEqual(['dummy1', 'dummy2']);
            expect(axios.get).toHaveBeenCalledWith('?key=k&rev=1');
            expect(axios.get).toHaveBeenCalledWith('?key=k&rev=2');

            jest.restoreAllMocks();
        });
    });
});