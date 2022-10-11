// this js source code is adpated based on https://github.com/yosbelms/hoctane
// which depends on Modules
// "fast-decode-uri-component": "^1.0.1",
// "path-to-regexp": "^2.1.0"
// method findLPM is added to meet requirement of CCN to identify the longest prefix matching item

"use strict";
// High-Octane route store/retriever
// Author: Yosbel Marín
// License: MIT
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = __importDefault(require("path-to-regexp"));
var fastDecode = require('fast-decode-uri-component');
var hasOwnProp = Object.prototype.hasOwnProperty;
var safeDecodeURIComponent = function (str) {
    try {
        return fastDecode(str);
    }
    catch (e) {
        return str;
    }
};
/* Remove the last "/" if present */
var trimEndingSlash = function (path) {
    if (path && path.length > 1 && '/' === path.charAt(path.length - 1)) {
        return path.substring(0, path.length - 1);
    }
    return path;
};
/* Create e new node */
var createNode = function () { return ({
    routes: []
}); };
/* Allocate the route inside the preferred a node */
var storeRoute = function (node, route) {
    var _a = route.tokens, tokens = _a === void 0 ? [] : _a;
    var contantSegment = ((tokens[0] && 'string' === typeof tokens[0]) ? tokens[0] : '');
    var segments = contantSegment.split('/');
    var len = segments.length;
    for (var i = 0; i < len; i++) {
        var segment = segments[i];
        if (!node.children) {
            node.children = {};
        }
        if (!hasOwnProp.call(node.children, segment)) {
            node.children[segment] = createNode();
        }
        node = node.children[segment];
        // if there is no more segments
        // insert it in the current node
        if (i === len - 1) {
            // store a copy of the route to prevent conflict
            node.routes.push(route);
        }
    }
};
/* Compress nodes by removing the child that doesn't contains routes */
var compressNode = function (node, parent) {
    var childrenMap = node.children;
    // traverse children fist (post order)
    if (childrenMap) {
        var children = Object.keys(childrenMap).map(function (key) { return childrenMap[key]; });
        children.forEach(function (child) { return compressNode(child, node); });
    }
    // move routes just if
    if (
    // has parent
    parent
        // parent has no routes
        && parent.routes.length === 0
        // parent has only one child (current node)
        && countChildren(parent) === 1
        // the node has no children (is leaf)
        && countChildren(node) === 0) {
        // convert the parent in a leaf
        delete parent.children;
        // move the node routes to the parent
        parent.routes = node.routes;
    }
    return node;
};
/* Returns the number of children in a node */
var countChildren = function (node) {
    return node.children ? Object.keys(node.children).length : 0;
};
/* Find a node in the tree */
var findNodeByPath = function (node, path) {
    var segments = path.split('/');
    var len = segments.length;
    var i = 0;
    var segment;
    while (node.children && i < len) {
        segment = segments[i];
        if (!hasOwnProp.call(node.children, segment))
            break;
        node = node.children[segment];
        i++;
    }
    return node;
};
/* Create a new route */
var createRoute = function (path, index) {
    path = trimEndingSlash(path);
    var paramsSpec = [];
    var tokens = path_to_regexp_1.default.parse(path);
    var generateUrl = path_to_regexp_1.default.compile(path);
    var regexp = path_to_regexp_1.default.tokensToRegExp(tokens, paramsSpec, {
        sensitive: true,
        end: true,
        strict: false
    });
    return {
        index: index,
        path: path,
        regexp: regexp,
        tokens: tokens,
        paramsSpec: paramsSpec,
        generateUrl: generateUrl
    };
};
/* Find the route object in the Trie and the match after apply the route regexp */
var findRouteAndMatch = function (node, path) {
    var routes = node.routes;
    var len = routes.length;
    for (var i = 0; i < len; i++) {
        var route = routes[i];
        var match = route.regexp.exec(path);
        if (match) {
            return {
                route: route,
                match: match
            };
        }
    }
};
/* Extract params from a route */
var getParams = function (route, match) {
    var _a = route.paramsSpec, paramsSpec = _a === void 0 ? [] : _a;
    var len = paramsSpec.length;
    var params = {};
    var paramValue;
    for (var i = 0; i < len; i++) {
        paramValue = match[i + 1];
        params[paramsSpec[i].name] = (paramValue === void 0 ? paramValue : safeDecodeURIComponent(paramValue));
    }
    return params;
};
/* Store of routes */
var Store = /** @class */ (function () {
    function Store() {
        this.root = createNode();
        this.routes = [];
    }
    /* Returns the root node of the Trie */
    Store.prototype.getRootNode = function () {
        return this.root;
    };
    /* Returns stored routes */
    Store.prototype.getRoutes = function () {
        return this.routes;
    };
    /* Build the Trie */
    Store.prototype.build = function () {
        var _this = this;
        this.routes.forEach(function (route) { return storeRoute(_this.root, route); });
        this.root = compressNode(this.root);
    };
    /* Add a new route */
    Store.prototype.add = function (path) {
        var nextIndex = this.routes.length;
        var newRoute = createRoute(path, nextIndex);
        this.routes.push(newRoute);
        return newRoute;
    };
    /* Find a route */
    Store.prototype.find = function (path) {
        var foundNode = findNodeByPath(this.root, path);
        if (foundNode) {
            var routeAndMatch = findRouteAndMatch(foundNode, path);
            if (routeAndMatch) {
                return {
                    route: routeAndMatch.route,
                    params: getParams(routeAndMatch.route, routeAndMatch.match)
                };
            }
        }
    };
    Store.prototype.findLPM = function (path) {
        let node = findNodeByPath(this.root, path);
        if (node) {
            if (node.routes.length == 0) {
                return '/';  // the root
            } else {
                return node.routes[0].path;
            }
        }
    };
    return Store;
}());
exports.Store = Store;
function cleanPath(path) {
    return path.replace(/\/+/g, '/');
}
exports.cleanPath = cleanPath;
