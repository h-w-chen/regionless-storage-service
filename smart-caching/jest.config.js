const config = {
  verbose: true,
  collectCoverageFrom: [
    "leaf/*.js",
    "adapter/*.js",
    "icn-protocol/*.js",
    "!icn-protocol/routes.js",
    "!leaf/leaf.js",
    "!adapter/adapter.js",
  ],
};

module.exports = config;
