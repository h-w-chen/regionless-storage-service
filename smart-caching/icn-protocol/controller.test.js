const Controller = require('./controller')
const Cache = require('../leaf/cache');
const cacheTest = new Cache();
const ctrlTest = new Controller(cacheTest);

beforeAll(() => {
    ctrlTest.irt.interests.set('wiz', new Set('abc'));
});

it('Controller processes interest request', ()=>{
    ctrlTest.ReuestInterest('foo', '12345');
    expect([...ctrlTest.irt.list('foo')]).toEqual(['12345']);
    // todo: ensure new IM sent out too
});

it('Controller broadcasts interesting sessions', ()=>{
    const spy = jest.spyOn(cacheTest.emitter, 'emit');
    ctrlTest.OnContent('wiz');
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls).toEqual([['a'], ['b'], ['c']]);
});