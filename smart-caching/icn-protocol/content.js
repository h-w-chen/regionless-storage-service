// ICN protocol: Content Massage of rkv static data
// static content sample:
//      [
//          {rev: 1, code: 200, value: "foo"},
//          {rev: 3, code: 404}
//      ]
const Content = class {
    constructor(name, revStart, revEnd, content) {
        this.name = name;
        this.revStart = revStart;
        this.revEnd = revEnd;
        this.contentStatic = content;
    }
};

module.exports = Content;
