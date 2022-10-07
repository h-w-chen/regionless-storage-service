const Controller = require('./controller');
const Cache = require('../leaf/cache');
const cacheTest = new Cache();
const ctrlTest = new Controller(cacheTest);

beforeAll(() => {
    ctrlTest.irt.interests.set('wiz:2', new Set('abc'));
});

it('Controller processes interest request', ()=>{
    id = ctrlTest.RequestInterest('foo', '12345');
    expect(id).toBe('12345');
    expect([...ctrlTest.irt.list('foo')]).toEqual([id]);
    // todo: ensure new IM sent out too
});

it('Controller broadcasts interesting sessions', ()=>{
    const spy = jest.spyOn(cacheTest.emitter, 'emit');
    payload = {code: 234, value: 'val of wiz-2'};
    ctrlTest.OnContent({name: 'wiz', revStart: 2, contentStatic: JSON.stringify(payload)});
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls).toEqual([['a'], ['b'], ['c']]);
    expect(cacheTest.getKeyOfRev('wiz', 2)).toEqual(payload);
});
