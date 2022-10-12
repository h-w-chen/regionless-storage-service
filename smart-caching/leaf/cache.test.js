timeout = 2000; // test setting

const Cache = require('./cache');
const cacheTest = new Cache({ max: 3 });

describe('cache api', () => {
    beforeAll(() => {
        // test data
        cacheTest.setKeyOfRev('a', 1, { code: 200, value: "a-1 val" });

        const ctrlFake = {
            RequestInterest: jest.fn().mockReturnValue('dummy-id'),
            RemoveInterest: jest.fn(),
        };
        cacheTest.setController(ctrlFake);
    });

    it('cache hit', async () => {
        let v = await cacheTest.fetchKeyOfRev('a', 1);
        expect(v.code).toBe(200);
        expect(v.value).toBe('a-1 val');
    });

    it('cache miss', async () => {
        try {
            let v = await cacheTest.fetchKeyOfRev('b', 1);
        } catch (e) {
            expect(e).toEqual(Error('timed out; not in cache yet'));
        }
    });

    it('cache missed initially and soon populated', async () => {
        let mock = jest.fn();
        mock.mockReturnValueOnce('dummy kvstore returned');
        originalGetKeyOfRev = cacheTest.getKeyOfRev; // will be restored right after
        cacheTest.getKeyOfRev = mock;
        setTimeout(() => {
            cacheTest.emitter.emit('dummy-id');
        }, 1000);
        let v = await cacheTest.fetchKeyOfRev('c', 3);
        expect(v).toBe('dummy kvstore returned');
        cacheTest.getKeyOfRev = originalGetKeyOfRev; // restore the monkey patch
    });
});

describe('cache LRU property', () => {
    it('cache evict when it is full', () => {
        cacheTest.setKeyOfRev('foo', 1, 'val 1');
        cacheTest.setKeyOfRev('foo', 2, 'val 2');
        cacheTest.setKeyOfRev('foo', 3, 'val 3');
        foo_1 = cacheTest.getKeyOfRev('foo', 1);
        expect(foo_1).toBe('val 1');
        cacheTest.setKeyOfRev('foo', 4, 'val 4');
        foo_2 = cacheTest.getKeyOfRev('foo', 2);
        expect(foo_2).toBeUndefined();
        foo_1 = cacheTest.getKeyOfRev('foo', 1);
        expect(foo_1).toBe('val 1');
    });
});