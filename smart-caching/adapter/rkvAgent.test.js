const Interest = require('../icn-protocol/interest');
const RKVAgent = require('./rkvAgent');

//jest.mock('axios');
const axios = require('axios');

describe('rkv agant', () => {
    describe('given an interest', () => {
        it('should send out various rkv requests', async () => {
            jest.spyOn(axios, 'create').mockImplementation(() =>  axios);
            jest.spyOn(axios, 'get')
                .mockResolvedValueOnce({status: 201, data: 'dummy1'})
                .mockResolvedValueOnce({status: 202, data: 'dummy2'})
                .mockRejectedValueOnce({response: {status: 555, data: 'dummy error'}});
            const testAgant = new RKVAgent('http://127.0.0.1:8090/kv');

            const contentExpected = {
                "name": "k",
                "revStart": 1,
                "revEnd": 3,
                "contentStatic": [
                    {rev: 1, code: 201, value: "dummy1"},
                    {rev: 2, code: 202, value: "dummy2"},
                    {rev: 3, code: 555, value: "dummy error"},
                ]};

            const interest = new Interest('k', 1, 3);
            const content = await testAgant.processInterest(interest);
            expect(content).toEqual(contentExpected);
            expect(axios.get).toHaveBeenCalledWith('?key=k&rev=1');
            expect(axios.get).toHaveBeenCalledWith('?key=k&rev=2');

            jest.restoreAllMocks();
        });
    });
});