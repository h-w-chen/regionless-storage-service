// rkv agant (like a client)

const axios = require('axios');

const RKVAgent = class {
    constructor(url) {
        this.client = axios.create({
            baseURL: url,
            headers: { 'Content-Type': 'application/json'},
        });
    }

    async request(interest) {
        const reqs = [];
        for (let i = interest.revStart; i <= interest.revEnd; i+=1) {
            reqs.push(this.client.get(`?key=${interest.name}&rev=${i}`));
        }
        const resps = await Promise.all(reqs);
        return resps;
    }
    
};

module.exports = RKVAgent;
