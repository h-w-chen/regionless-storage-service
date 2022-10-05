const Cache = require('./cache');
const cacheTest = new Cache();

beforeAll(() => {
    // test data
    cacheTest.setKeyOfRev('a', 1, 'a-1 val');
});

it('cache hit', async ()=>{
    let v = await cacheTest.fetchKeyOfRev('a', 1);
    expect(v).toBe('a-1 val');
});

it('cache miss', async ()=>{
    try{
        let v = await cacheTest.fetchKeyOfRev('b', 1);
    } catch (e) {
        expect(e).toEqual(Error('timed out; not in cache yet'));
    }
});

it('cache missed initially and soon populated', async ()=>{
    setTimeout(() => {
        cacheTest.emitter.emit('c:3');
    }, 1000 );
    let v = await cacheTest.fetchKeyOfRev('c', 3);
    expect(v).toBe('lazy populated; to impl');
});