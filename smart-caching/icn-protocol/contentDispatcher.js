const axios = require('axios');

const ContentDispatcher = class {
    constructor(contentPort) {
        this.contentPort = contentPort;
        this.client = axios.create(
            { headers: { 'Content-Type': 'application/json' }, }
        );
    }

    async sendContent(nodes, content) {
        const reqs = [];
        for (const node of nodes) {
            console.log(`<<<<<< content to ${node}: `, content);
            reqs.push(this.client
                .post(`http://${node}:${this.contentPort}/contents`, content)
                .catch((e) => { return { status: e.errno }; }));
        }
        return await Promise.all(reqs);
    }

    async attemptOnDeadLetters(pendingContents, irt) {
        if (pendingContents.size === 0)
            return;

        console.log(`...... checking dead letters, timestamp: ${new Date()}`);
        for (const content of pendingContents) {
            const interestKey = content.interestKey();
            const undelivereds = irt.list(interestKey);
            const nodes = Array.from(undelivereds);
            console.log(`......... trying to deliver ${interestKey} to ${nodes}`);
            for (const node of nodes) {
                const resp = await this.sendContent([node], content);
                //console.log('--------', resp);
                if (resp[0].status === 200) {
                    console.log(`-------- ${interestKey} delivered to ${node}`);
                    irt.delist(interestKey, node);
                }
            };
            if (!irt.list(interestKey)) {
                pendingContents.delete(content);
                console.log(`------ successfully re-delivered: ${interestKey}`);
            }
        }
    }
};

function createContentDispatcher(contentPort) {
    return new ContentDispatcher(contentPort);
}

module.exports = createContentDispatcher;
