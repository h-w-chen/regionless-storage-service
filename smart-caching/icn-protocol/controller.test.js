const Controller = require('./controller');
const Cache = require('../leaf/cache');
const cacheTest = new Cache();
const ctrlTest = new Controller(
    cacheTest,
    new Map([['/', ['127.0.0.1:10101']]]));

jest.mock("axios");
const mockAxios = require("axios");
mockAxios.post.mockImplementation((node) => Promise.resolve(node));

describe('icn controller', () => {
    describe('given pre-populated irt', () => {
        beforeAll(() => {
            ctrlTest.irt.interests.set('wiz:2', new Set('abc'));
            ctrlTest.irt.interests.set('torm:3:3', new Set(['foo', 'bar']));
        });

        it('Controller processes interest request', ()=>{
            id = ctrlTest.RequestInterest('foo', '12345');
            expect(id).toBe('12345');
            expect([...ctrlTest.irt.list('foo')]).toEqual([id]);
            // todo: ensure new IM sent out too
        });

        it('Controller broadcasts interesting sessions', ()=>{
            const spy = jest.spyOn(cacheTest.emitter, 'emit');
            payload = {rev: 2, code: 234, value: 'val of wiz-2'};
            ctrlTest.OnContent({name: 'wiz', revStart: 2, contentStatic: [payload]});
            expect(spy).toHaveBeenCalledTimes(3);
            expect(spy.mock.calls).toEqual([['a'], ['b'], ['c']]);
            expect(cacheTest.getKeyOfRev('wiz', 2)).toEqual({code: 234, value: 'val of wiz-2'});
        });

        it('remove interest should delist session id from interest', () => {
            expect(ctrlTest.irt.list('torm:3:3')).toEqual(new Set(['foo', 'bar']));
            ctrlTest.RemoveInterest('torm:3:3', 'foo');
            expect(ctrlTest.irt.list('torm:3:3')).toEqual(new Set(['bar']));
        });
    });
});
