const createContentDispatcher = require('./contentDispatcher');
const Content = require('./content');
const axios = require('axios');

describe('content dispatcher', () => {
    beforeEach(() => {
        jest.spyOn(axios, 'create').mockImplementation(() => axios);
        jest.spyOn(axios, 'post')
            .mockResolvedValueOnce({status: 201, data: 'dummy1'})
            .mockResolvedValueOnce({status: 202, data: 'dummy2'});
        this.contentDispatcher = createContentDispatcher();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('given set of nodes, and content', () => {
        it('should fan out contnt to all nodes', async () => {
            const nodes = new Set(['1.1.1.1', '2.2.2.2']);
            const content = new Content('test', 3, 4, {value: 'dummy'});

            const respExpected = [
                {status: 201, data: 'dummy1'},
                {status: 202, data: 'dummy2'},
            ];
            const resps = await this.contentDispatcher.sendContent(nodes, content);
            expect(resps).toEqual(respExpected);
            expect(axios.post).toHaveBeenCalledWith('http://1.1.1.1:10085/contents', content);
            expect(axios.post).toHaveBeenCalledWith('http://2.2.2.2:10085/contents', content);
        });
    });
});