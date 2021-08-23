"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewOrderMsg = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _big = _interopRequireDefault(require("big.js"));

var _ = require("../");

var crypto = _interopRequireWildcard(require("../../../crypto"));

var _tx = require("../../tx");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var BASENUMBER = Math.pow(10, 8);

var NewOrderMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(NewOrderMsg, _BaseMsg);

  var _super = _createSuper(NewOrderMsg);

  function NewOrderMsg(data, address) {
    var _this;

    (0, _classCallCheck2["default"])(this, NewOrderMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "newOrder", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "address", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "aminoPrefix", _tx.AminoPrefix.NewOrderMsg);
    var bigPrice = new _big["default"](data.price);
    var bigQuantity = new _big["default"](data.quantity);
    _this.newOrder = data;
    _this.newOrder.price = Number(bigPrice.mul(BASENUMBER).toString());
    _this.newOrder.quantity = Number(bigQuantity.mul(BASENUMBER).toString());
    _this.address = address;
    return _this;
  }

  (0, _createClass2["default"])(NewOrderMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var signMsg = _objectSpread({
        sender: this.address
      }, this.newOrder);

      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        sender: crypto.decodeAddress(this.address),
        id: this.newOrder.id,
        symbol: this.newOrder.symbol,
        ordertype: this.newOrder.ordertype,
        side: this.newOrder.side,
        price: this.newOrder.price,
        quantity: this.newOrder.quantity,
        timeinforce: this.newOrder.timeinforce,
        aminoPrefix: this.aminoPrefix
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        sender: Buffer.from(""),
        id: "",
        symbol: "",
        orderType: 0,
        side: 0,
        price: 0,
        quantity: 0,
        timeinforce: 0,
        aminoPrefix: _tx.AminoPrefix.NewOrderMsg
      };
    }
  }]);
  return NewOrderMsg;
}(_.BaseMsg);

exports.NewOrderMsg = NewOrderMsg;