const {Store} = require('./routes');

describe('LPM routes', () => {
    it('should identify the longest prefix route path', () => {
        const store = new Store();
        store.add('/')
        store.add('/foo')
        store.add('/foo/bar')
        store.build()
    
        expect(store.findLPM('/foo/bar/1')).toBe('/foo/bar');
        expect(store.findLPM('/x/y')).toBe('/');
        expect(store.findLPM('/foo/y/bar')).toBe('/foo');    
    });
});