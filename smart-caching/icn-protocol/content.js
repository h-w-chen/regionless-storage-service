// ICN protocol: Content Massage of rkv static data
const Content = class {
    constructor(name, revStart, revEnd, content) {
        this.name = name;
        this.revStart = revStart;
        this.revEnd = revEnd;
        this.contentStatic = content;
    }
};

module.exports = Content;
