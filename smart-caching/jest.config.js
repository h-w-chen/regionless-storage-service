const config = {
  verbose: false,
  collectCoverageFrom: [
        "leaf/*.js",
        "adapter/*.js",
        "icn-protocol/*.js",
	"!icn-protocol/routes.js"
  ],
};

module.exports = config;
