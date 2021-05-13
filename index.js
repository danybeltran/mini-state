"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.useAppReducer = exports.useGlobalState = exports.AppContext = void 0;
var react_1 = require("react");
var _global = {
    app: {
        events: {}
    },
    contexts: {
        app: react_1.createContext({})
    }
};
exports.AppContext = _global.contexts.app;
function useGlobalState() {
    /**
     * @type { GlobalStateReturnType  }
     */
    var context = react_1.useContext(exports.AppContext);
    return context;
}
exports.useGlobalState = useGlobalState;
function reduce() {
    return function reducer(state, event) {
        return __assign({}, event(state));
    };
}
function useAppReducer(state, optionalActions) {
    var _a = react_1.useReducer(reduce(), state), state2 = _a[0], emit = _a[1];
    function em(event, cb) {
        if (event === void 0) { event = ""; }
        if (_global.app.events[event]) {
            _global.app.events[event]();
        }
        else {
            console.error("No listener(s) for '" + event + "' event");
        }
        emit(function () { return cb(state2); });
    }
    function on(eventName, callback) {
        if (eventName === void 0) { eventName = ""; }
        _global.app.events[eventName] = function () { return callback(state2); };
        return undefined;
    }
    var dispatchers = {};
    var _loop_1 = function (dispatcher) {
        var cb = optionalActions[dispatcher];
        dispatchers[dispatcher] = function () {
            em(dispatcher, cb);
        };
    };
    for (var dispatcher in optionalActions) {
        _loop_1(dispatcher);
    }
    var globalState = {
        state: state2,
        emit: em,
        on: on,
        actions: dispatchers
    };
    return globalState;
}
exports.useAppReducer = useAppReducer;
