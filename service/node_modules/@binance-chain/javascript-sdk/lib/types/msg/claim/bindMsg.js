"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BindMsg = void 0;

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

var BindMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(BindMsg, _BaseMsg);

  var _super = _createSuper(BindMsg);

  function BindMsg(_ref) {
    var _this;

    var from = _ref.from,
        symbol = _ref.symbol,
        amount = _ref.amount,
        contract_address = _ref.contract_address,
        contract_decimals = _ref.contract_decimals,
        expire_time = _ref.expire_time;
    (0, _classCallCheck2["default"])(this, BindMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "from", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "symbol", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "amount", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "contract_address", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "contract_decimals", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "expire_time", void 0);
    _this.from = from;
    _this.symbol = symbol;
    _this.amount = amount;
    _this.contract_address = contract_address;
    _this.contract_decimals = contract_decimals;
    _this.expire_time = expire_time;
    return _this;
  }

  (0, _createClass2["default"])(BindMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      return {
        from: this.from,
        symbol: this.symbol,
        amount: this.amount,
        contract_address: this.contract_address,
        contract_decimals: this.contract_decimals,
        expire_time: this.expire_time
      };
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      return {
        from: crypto.decodeAddress(this.from),
        symbol: this.symbol,
        amount: this.amount,
        contract_address: Buffer.from(this.contract_address.slice(2), "hex"),
        contract_decimals: this.contract_decimals,
        expire_time: this.expire_time,
        aminoPrefix: _tx.AminoPrefix.BindMsg
      };
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        from: Buffer.from(""),
        symbol: "",
        amount: 0,
        contract_address: Buffer.from(""),
        contract_decimals: 0,
        expire_time: 0,
        aminoPrefix: _tx.AminoPrefix.BindMsg
      };
    }
  }]);
  return BindMsg;
}(_.BaseMsg);

exports.BindMsg = BindMsg;