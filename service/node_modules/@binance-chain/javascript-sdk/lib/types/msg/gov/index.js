"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _submitProposal = require("./submitProposal");

Object.keys(_submitProposal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _submitProposal[key];
    }
  });
});