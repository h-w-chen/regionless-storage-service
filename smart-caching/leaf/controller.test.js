const createController = require('./controller');
const Cache = require('./cache');
const cacheTest = new Cache();
const ctrlTest = createController(
    cacheTest,
    new Map([['/', ['127.0.0.1:10101']]]));

const Content = require('../icn-protocol/content');

jest.mock("axios");
const mockAxios = require("axios");
mockAxios.post.mockImplementation((node) => Promise.resolve(node));

describe('icn controller', () => {
    describe('given pre-populated pit', () => {
        beforeAll(() => {
            jest.restoreAllMocks();
            ctrlTest.pit.add('wiz:2:2');
            ctrlTest.pit.add('torm:3:3');
        });

        it('should insert interest in pit', ()=>{
            ctrlTest.requestInterest('foo');
            expect(ctrlTest.pit.has('foo')).toBeTruthy();
        });

        it('should emit interesting event', ()=>{
            const spy = jest.spyOn(cacheTest.emitter, 'emit');
            payload = {rev: 2, code: 234, value: 'val of wiz-2'};
            ctrlTest.onContent(new Content('wiz', 2, 2, [payload]));
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls).toEqual([['wiz:2:2']]);
            expect(cacheTest.getKeyOfRev('wiz', 2)).toEqual({code: 234, value: 'val of wiz-2'});
        });

        it('should remove interest from pit', () => {
            expect(ctrlTest.pit.has('torm:3:3')).toBeTruthy();
            ctrlTest.removeInterest('torm:3:3');
            expect(ctrlTest.pit.has('torm:3:3')).toBeFalsy();
        });
    });
});
