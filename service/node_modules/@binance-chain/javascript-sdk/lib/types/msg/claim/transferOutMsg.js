"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferOutMsg = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _big = _interopRequireDefault(require("big.js"));

var _ = require("..");

var crypto = _interopRequireWildcard(require("../../../crypto"));

var _tx = require("../../tx");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var TransferOutMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(TransferOutMsg, _BaseMsg);

  var _super = _createSuper(TransferOutMsg);

  function TransferOutMsg(_ref) {
    var _this;

    var from = _ref.from,
        to = _ref.to,
        amount = _ref.amount,
        expire_time = _ref.expire_time;
    (0, _classCallCheck2["default"])(this, TransferOutMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "from", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "to", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "amount", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "expire_time", void 0);
    _this.from = from;
    _this.to = to;
    _this.amount = _objectSpread(_objectSpread({}, amount), {}, {
      amount: Number(new _big["default"](amount.amount).mul(Math.pow(10, 8)).toString())
    });
    _this.expire_time = expire_time;
    return _this;
  }

  (0, _createClass2["default"])(TransferOutMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      return {
        from: this.from,
        to: this.to,
        amount: this.amount,
        expire_time: this.expire_time
      };
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      return {
        from: crypto.decodeAddress(this.from),
        to: Buffer.from(this.to.slice(2), "hex"),
        amount: this.amount,
        expire_time: this.expire_time,
        aminoPrefix: _tx.AminoPrefix.TransferOutMsg
      };
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        from: Buffer.from(""),
        to: Buffer.from(""),
        amount: {
          denom: "",
          amount: 0
        },
        expire_time: 0,
        aminoPrefix: _tx.AminoPrefix.TransferOutMsg
      };
    }
  }]);
  return TransferOutMsg;
}(_.BaseMsg);

exports.TransferOutMsg = TransferOutMsg;