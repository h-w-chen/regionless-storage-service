const Cache = require('./cache');
const cacheTest = new Cache();

beforeAll(() => {
    // test data
    cacheTest.setKeyOfRev('a', 1, {code:200, value:"a-1 val"});

    const ctrlFake = {
        RequestInterest: jest.fn().mockReturnValue('dummy-id'),
        RemoveInterest: jest.fn(),
    };
    cacheTest.setController(ctrlFake);
});

it('cache hit', async ()=>{
    let v = await cacheTest.fetchKeyOfRev('a', 1);
    expect(v.code).toBe(200);
    expect(v.value).toBe('a-1 val');
});

it('cache miss', async ()=>{
    try{
        let v = await cacheTest.fetchKeyOfRev('b', 1);
    } catch (e) {
        expect(e).toEqual(Error('timed out; not in cache yet'));
    }
});

it('cache missed initially and soon populated', async ()=>{
    let mock = jest.fn();
    mock.mockReturnValueOnce('dummy kvstore returned');
    originalGetKeyOfRev = cacheTest.getKeyOfRev; // will be restored right after
    cacheTest.getKeyOfRev = mock;
    setTimeout(() => {
        cacheTest.emitter.emit('dummy-id');
    }, 1000 );
    let v = await cacheTest.fetchKeyOfRev('c', 3);
    expect(v).toBe('dummy kvstore returned');
    cacheTest.getKeyOfRev = originalGetKeyOfRev; // restore the monkey patch
});
