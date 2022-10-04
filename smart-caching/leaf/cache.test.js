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
        expect(e).toEqual(Error('not in cache yet'));
    }
});