const axios = require('axios');

const ContentDispatcher = class {
    constructor(contentPort) {
        this.contentPort = contentPort;
        this.client = axios.create(
            {headers: {'Content-Type': 'application/json'},}
        );
    }

    async sendContent(nodes, content) {
        const reqs = [];
        for(let node of nodes) {
            console.log(`<<<<<< content to ${node}: `, content);
            reqs.push(this.client.post(`http://${node}:${this.contentPort}/contents`, content)
                        .catch((e) => {return {status: e.errno}; }));
        }
        return await Promise.all(reqs);
    }
};

function createContentDispatcher(contentPort) {
    return new ContentDispatcher(contentPort);
}

module.exports = createContentDispatcher;
