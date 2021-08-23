"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMsgByAminoPrefix = exports.convertObjectArrayNum = exports.divide = exports.BASENUMBER = void 0;

var _big = _interopRequireDefault(require("big.js"));

var _types = require("../types");

var BASENUMBER = Math.pow(10, 8);
exports.BASENUMBER = BASENUMBER;

var divide = function divide(num) {
  return +new _big["default"](num).div(BASENUMBER).toString();
};

exports.divide = divide;

var convertObjectArrayNum = function convertObjectArrayNum(objArr, keys) {
  objArr.forEach(function (item) {
    keys.forEach(function (key) {
      item[key] = divide(item[key]);
    });
  });
}; //TODO add gov and swap


exports.convertObjectArrayNum = convertObjectArrayNum;

var getMsgByAminoPrefix = function getMsgByAminoPrefix(aminoPrefix) {
  switch (aminoPrefix.toUpperCase()) {
    case _types.AminoPrefix.NewOrderMsg:
      return _types.NewOrderMsg;

    case _types.AminoPrefix.CancelOrderMsg:
      return _types.CancelOrderMsg;

    case _types.AminoPrefix.MsgSend:
      return _types.SendMsg;

    case _types.AminoPrefix.IssueMsg:
      return _types.IssueTokenMsg;

    case _types.AminoPrefix.FreezeMsg:
      return _types.FreezeTokenMsg;

    case _types.AminoPrefix.UnfreezeMsg:
      return _types.UnFreezeTokenMsg;

    case _types.AminoPrefix.BurnMsg:
      return _types.BurnTokenMsg;

    case _types.AminoPrefix.MintMsg:
      return _types.MintTokenMsg;

    case _types.AminoPrefix.TimeLockMsg:
      return _types.TimeLockMsg;

    case _types.AminoPrefix.TimeRelockMsg:
      return _types.TimeReLockMsg;

    case _types.AminoPrefix.TimeUnlockMsg:
      return _types.TimeUnlockMsg;

    default:
      return _types.BaseMsg;
  }
};

exports.getMsgByAminoPrefix = getMsgByAminoPrefix;