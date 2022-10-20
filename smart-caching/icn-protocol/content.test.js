const Content = require('./content');
const IRT = require('./irt');

describe('content class', () => {
    it('should derive interest key', () => {
        const content = new Content('myname', 7, 19);
        expect(content.interestKey()).toBe('myname:7:19');
    });
});