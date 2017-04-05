'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ROCKEY_MIXIN_HANDLER_KEY = undefined;

var _rockey = require('rockey');

var ROCKEY_MIXIN_HANDLER_KEY = (exports.ROCKEY_MIXIN_HANDLER_KEY = '__ROCKEY_MIXIN_HANDLER_KEY__');

var handler = function handler(event, condition) {
  return function() {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    var rockeyWhenFunction = (0, _rockey.when)(function() {
      return true;
    }).apply(undefined, args);

    var eventArguments = null;
    var mixin = function mixin() {
      return eventArguments ? rockeyWhenFunction(eventArguments) : null;
    };

    mixin[ROCKEY_MIXIN_HANDLER_KEY] = true;
    mixin.assign = function() {
      for (
        var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2] = arguments[_key2];
      }

      if (condition.apply(undefined, args)) {
        eventArguments = args;
        return true;
      } else {
        eventArguments = null;
        return false;
      }
    };

    mixin.event = event;

    return mixin;
  };
};

exports.default = handler;
