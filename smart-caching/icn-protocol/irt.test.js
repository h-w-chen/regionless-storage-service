const IRT = require('./irt');
const irt = new IRT();

beforeAll(() => {
    irt.interests.set('foo', new Set().add('a').add('b'));
    irt.interests.set('wiz', new Set().add('x').add('y'));
});

it('PIT list requests by interest', () => {
    reqs = irt.list('wiz');
    expect([...reqs]).toEqual(['x', 'y']);
});

it('PIT enlist new request', () => {
    irt.enlist('bar', '12345');
    expect([...irt.interests.get('bar')]).toEqual(['12345']);

    irt.enlist('bar', '88888');
    expect([...irt.interests.get('bar')]).toEqual(['12345', '88888']);
});

it('PIT delist requests', () => {
    irt.delist('foo', 'a');
    expect([...irt.interests.get('foo')]).toEqual(['b']);

    irt.delist('foo', 'b');
    expect(irt.interests.get('foo')).toBeUndefined();
});
