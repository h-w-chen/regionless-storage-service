// ICN protocol: interest massge

const Interest = class {
    constructor(name, revStart, revEnd) {
        this.name = name;
        this.revStart = revStart || 0;
        this.revEnd = revEnd || -1;
    }
};

module.exports = Interest;
