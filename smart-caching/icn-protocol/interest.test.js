const Interest = require('./interest');

it('to create interest with full params', () => {
    let interest = new Interest('a/b/c', 1, 99);
    expect(interest).toEqual(JSON.parse('{"name": "a/b/c", "revEnd": 99, "revStart": 1}'));
});

it('to create interest with default revEnd', () => {
    let interest = new Interest('a/b/c', 1);
    expect(interest).toEqual(JSON.parse('{"name": "a/b/c", "revEnd": -1, "revStart": 1}'));
});

it('to create interest with default revStart', () => {
    let interest = new Interest('a/b/c', undefined,99);
    expect(interest).toEqual(JSON.parse('{"name": "a/b/c", "revEnd": 99, "revStart": 0}'));
});
