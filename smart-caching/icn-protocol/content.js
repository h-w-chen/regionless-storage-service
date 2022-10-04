// ICN protocol: Content Massage

const Content = class {
    constructor(name, revStart, revEnd, content) {
        this.name = name;
        this.revStart = revStart;
        this.revEnd = revEnd;
        this.content = content;
    }
};

module.exports = Content;
