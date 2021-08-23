"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeReLockMsg = void 0;

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

var TimeReLockMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(TimeReLockMsg, _BaseMsg);

  var _super = _createSuper(TimeReLockMsg);

  function TimeReLockMsg(_ref) {
    var _this;

    var address = _ref.address,
        time_lock_id = _ref.time_lock_id,
        description = _ref.description,
        amount = _ref.amount,
        lock_time = _ref.lock_time;
    (0, _classCallCheck2["default"])(this, TimeReLockMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "from", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "time_lock_id", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "description", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "lock_time", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "amount", void 0);
    _this.from = address;
    _this.description = description;
    _this.amount = amount;
    _this.lock_time = lock_time;
    _this.time_lock_id = time_lock_id;
    return _this;
  }

  (0, _createClass2["default"])(TimeReLockMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var signMsg = {
        from: this.from,
        time_lock_id: this.time_lock_id,
        amount: this.amount,
        description: this.description,
        lock_time: this.lock_time
      };
      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        from: crypto.decodeAddress(this.from),
        time_lock_id: this.time_lock_id,
        description: this.description,
        amount: this.amount,
        lock_time: this.lock_time,
        aminoPrefix: _tx.AminoPrefix.TimeRelockMsg
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        from: Buffer.from(""),
        description: "",
        amount: 0,
        lock_time: 0,
        aminoPrefix: _tx.AminoPrefix.TimeRelockMsg
      };
    }
  }]);
  return TimeReLockMsg;
}(_.BaseMsg);

exports.TimeReLockMsg = TimeReLockMsg;