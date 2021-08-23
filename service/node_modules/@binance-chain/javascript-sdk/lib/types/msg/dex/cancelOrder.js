"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancelOrderMsg = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var crypto = _interopRequireWildcard(require("../../../crypto"));

var _tx = require("../../tx");

var _base = require("../base");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var CancelOrderMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(CancelOrderMsg, _BaseMsg);

  var _super = _createSuper(CancelOrderMsg);

  function CancelOrderMsg(address, sybmol, orderId) {
    var _this;

    (0, _classCallCheck2["default"])(this, CancelOrderMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "address", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "symbol", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "orderId", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "aminoPrefix", _tx.AminoPrefix.CancelOrderMsg);
    _this.address = address;
    _this.symbol = sybmol;
    _this.orderId = orderId;
    return _this;
  }

  (0, _createClass2["default"])(CancelOrderMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var signMsg = {
        sender: this.address,
        symbol: this.symbol,
        refid: this.orderId
      };
      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        sender: crypto.decodeAddress(this.address),
        symbol: this.symbol,
        refid: this.orderId,
        aminoPrefix: _tx.AminoPrefix.CancelOrderMsg
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        sender: Buffer.from(""),
        symbol: "",
        refid: "",
        aminoPrefix: _tx.AminoPrefix.CancelOrderMsg
      };
    }
  }]);
  return CancelOrderMsg;
}(_base.BaseMsg);

exports.CancelOrderMsg = CancelOrderMsg;