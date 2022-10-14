// ICN protocol: interest massge of rkv static data
const Interest = class {
    constructor(name, revStart, revEnd) {
        this.name = name;
        this.revStart = revStart || 0;
        this.revEnd = revEnd || -1;
    }

    static FromObject(obj) {
        if (!obj.name || !obj.revStart || !obj.revEnd)
            throw new Error('invalid interest format');

        return new Interest(obj.name, obj.revStart, obj.revEnd);
    }

    key() {
        return `${this.name}:${this.revStart}:${this.revEnd}`;
    }
};

module.exports = Interest;
