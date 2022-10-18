const config = {
  verbose: false,
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
