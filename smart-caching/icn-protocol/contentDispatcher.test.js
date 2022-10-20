const createContentDispatcher = require('./contentDispatcher');
const Content = require('./content');
const axios = require('axios');

describe('content dispatcher', () => {
    describe('given node peers are able to receive contents', () => {
        beforeEach(() => {
            jest.spyOn(axios, 'create').mockImplementation(() => axios);
            jest.spyOn(axios, 'post')
                .mockResolvedValueOnce({ status: 201, data: 'dummy1' })
                .mockResolvedValueOnce({ status: 202, data: 'dummy2' });
            this.contentDispatcher = createContentDispatcher(11111);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('given set of nodes, and content', () => {
            it('should fan out contnt to all nodes', async () => {
                const nodes = ['1.1.1.1', '2.2.2.2'];
                const content = new Content('test', 3, 4, { value: 'dummy' });

                const respExpected = [
                    { status: 201, data: 'dummy1' },
                    { status: 202, data: 'dummy2' },
                ];
                const resps = await this.contentDispatcher.sendContent(nodes, content);
                expect(resps).toEqual(respExpected);
                expect(axios.post).toHaveBeenCalledWith('http://1.1.1.1:11111/contents', content);
                expect(axios.post).toHaveBeenCalledWith('http://2.2.2.2:11111/contents', content);
            });
        });
    });

    describe('given peer connection is not normal', () => {
        describe('given peer refuse connection', () => {
            beforeEach(() => {
                jest.spyOn(axios, 'create').mockImplementation(() => axios);
                jest.spyOn(axios, 'post')
                    .mockRejectedValueOnce({ errno: -111, cause: 'Error: connect ECONNREFUSED 127.0.0.1:10085'})
                    .mockResolvedValueOnce({ status: 200, data: 'dummy4' });
                this.contentDispatcher = createContentDispatcher();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should put undelivered content to deadletters box', async () => {
                const nodes = ['3.3.3.3', '4.4.4.4'];
                const content = new Content('reset', 1, 1, { value: 'deadbeef' });
                const resps = await this.contentDispatcher.sendContent(nodes, content);
                expect(resps).toEqual([{ status: -111 }, {status: 200, data: 'dummy4'}]);
            });
        });

        describe('given peer is offline', () => {
            beforeEach(() => {
                jest.spyOn(axios, 'create').mockImplementation(() => axios);
                jest.spyOn(axios, 'post')
                    .mockRejectedValueOnce({ errno: -110, cause: 'Error: connect ETIMEDOUT 5.5.5.5:10085'})
                    .mockResolvedValueOnce({ status: 200, data: 'dummy6' });
                this.contentDispatcher = createContentDispatcher();
            });
            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should put undelivered content to deadletters box', async () => {
                const nodes = ['5.5.5.5', '6.6.6.6'];
                const content = new Content('offline', 1, 1, { value: 'deadbeef' });
                const resps = await this.contentDispatcher.sendContent(nodes, content);
                expect(resps).toEqual([{status: -110}, {status: 200, data:'dummy6'}]);
            }, 1000*60*3);
        });
    });

    describe('given a few dead letters', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should attempt on them, and remove from dead box if delivered', async () => {
            const deadletter = new Content('dead1', 1, 1, 'dummy1');
            const deadletters = new Set([deadletter]);
            const irt = {};
            irt.__proto__.list = ()=>{};
            irt.__proto__.delist = jest.fn();
            jest.spyOn(irt, 'list')
                .mockReturnValueOnce(new Set(['7.7.7.7']))
                .mockReturnValueOnce(null);

            const dispatcher = createContentDispatcher(11111);
            jest.spyOn(dispatcher, 'sendContent').mockResolvedValueOnce([{status: 200}]);

            await dispatcher.attemptOnDeadLetters(deadletters, irt);
            expect(dispatcher.sendContent).toHaveBeenCalledWith(['7.7.7.7'], deadletter);
            expect(deadletters.size).toBe(0);
        });
    });
});