// rkv agant (like a client)

const Content = require('../icn-protocol/content')
const axios = require('axios');

const convertToContent = (name, revStart, revEnd, records) => {
    // todo: extract code
    const contentRecords = [];
    let i = 0;
    for (const record of records) {
        contentRecords.push({code: 200, rev: revStart + i, value: record});
        i += 1;
    }
    const content = new Content(name, revStart, revEnd, contentRecords);
    return content;
}

const request = async (client, interest) => {
    const reqs = [];
    for (let i = interest.revStart; i <= interest.revEnd; i+=1) {
        reqs.push(
            client.get(`?key=${interest.name}&rev=${i}`)
                .catch((e) => e.toString()));
    }
    const resps = await Promise.all(reqs);
    return resps;
}

const RKVAgent = class {
    constructor(url) {
        this.client = axios.create({
            baseURL: url,
            headers: { 'Content-Type': 'application/json'},
        });
    }

    async processInterest(interest) {
        const resps = await request(this.client, interest);
        return convertToContent(interest.name, interest.revStart, interest.revEnd, resps);
    }
};

module.exports = RKVAgent;
