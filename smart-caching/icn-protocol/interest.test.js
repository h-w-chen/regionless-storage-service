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

describe('interest convertion', ()=>{
    describe('given a valid object', () =>{
        it('should be able convert to Interest instance', () => {
            const obj = {name: 'k', revEnd: 3, revStart: 2};
            expect(Interest.FromObject(obj)).toEqual(new Interest('k', 2,3));
        });
    });

    describe('given an invalid object', () =>{
        it('should throw', () => {
            const obj = {revEnd: 3, revStart: 2, foo: 'k'};
            expect(() => Interest.FromObject(obj)).toThrow('invalid interest format');
        });
    });
});
