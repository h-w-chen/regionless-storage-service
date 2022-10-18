const axios = require('axios');

const ContentDispatcher = class {
    constructor() {
        this.client = axios.create(
            {headers: {'Content-Type': 'application/json'},}
        );
    }

    async sendContent(nodes, content) {
        const reqs = [];
        for(let node of nodes) {
            console.log(`<<<<<< content to ${node}: `, content);
            reqs.push(this.client.post(
                `http://${node}:10085/contents`,
                content));
        }
        return await Promise.all(reqs);
    }
};

function createContentDispatcher() {
    return new ContentDispatcher();
}

module.exports = createContentDispatcher;
