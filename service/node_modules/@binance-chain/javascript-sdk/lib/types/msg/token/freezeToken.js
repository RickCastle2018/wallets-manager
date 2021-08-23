"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FreezeTokenMsg = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require("../");

var crypto = _interopRequireWildcard(require("../../../crypto"));

var _tx = require("../../tx");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var FreezeTokenMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(FreezeTokenMsg, _BaseMsg);

  var _super = _createSuper(FreezeTokenMsg);

  function FreezeTokenMsg(_ref) {
    var _this;

    var address = _ref.address,
        sybmol = _ref.sybmol,
        amount = _ref.amount;
    (0, _classCallCheck2["default"])(this, FreezeTokenMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "from", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "symbol", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "amount", void 0);
    _this.from = address;
    _this.symbol = sybmol;
    _this.amount = amount;
    return _this;
  }

  (0, _createClass2["default"])(FreezeTokenMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var signMsg = {
        from: this.from,
        symbol: this.symbol,
        amount: this.amount
      };
      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        from: crypto.decodeAddress(this.from),
        symbol: this.symbol,
        amount: this.amount,
        aminoPrefix: _tx.AminoPrefix.FreezeMsg
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        from: Buffer.from(""),
        symbol: "",
        amount: 0,
        aminoPrefix: _tx.AminoPrefix.FreezeMsg
      };
    }
  }]);
  return FreezeTokenMsg;
}(_.BaseMsg);

exports.FreezeTokenMsg = FreezeTokenMsg;