"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  decoder: true,
  encoder: true
};
exports.encoder = exports.decoder = void 0;

var decoder = _interopRequireWildcard(require("./decoder"));

exports.decoder = decoder;
Object.keys(decoder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return decoder[key];
    }
  });
});

var encoder = _interopRequireWildcard(require("./encoder"));

exports.encoder = encoder;
Object.keys(encoder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return encoder[key];
    }
  });
});