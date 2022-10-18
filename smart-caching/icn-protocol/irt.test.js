const IRT = require('./irt');
const irt = new IRT();

describe('interest registration table', () => {
    beforeAll(() => {
        irt.interests.set('foo', new Set().add('a').add('b'));
        irt.interests.set('wiz', new Set().add('x').add('y'));
        irt.interests.set('del', new Set(['todel']));
    });

    it('list by interest should return collection of registered items', () => {
        reqs = irt.list('wiz');
        expect([...reqs]).toEqual(['x', 'y']);
    });

    it('enlist new request should insert proper records', () => {
        irt.enlist('bar', '12345');
        expect([...irt.interests.get('bar')]).toEqual(['12345']);

        irt.enlist('bar', '88888');
        expect([...irt.interests.get('bar')]).toEqual(['12345', '88888']);
    });

    it('delist should clean up registrations and even the empty interest slot', () => {
        irt.delist('foo', 'a');
        expect([...irt.interests.get('foo')]).toEqual(['b']);

        irt.delist('foo', 'b');
        expect(irt.interests.get('foo')).toBeUndefined();
    });

    it('given unexistent interest, delist should be no op', () => {
        irt.delist('nosuch', 1);
        // no error is fine
    });

    it('delete should remove interest slot', () => {
        irt.delete('del');
        expect(irt.interests.get('del')).toBeUndefined();
    });
});
