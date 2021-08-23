"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendMsg = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _big = _interopRequireDefault(require("big.js"));

var crypto = _interopRequireWildcard(require("../../crypto"));

var _tx = require("../tx");

var _ = require("./");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @ignore
 * Only support transfers of one-to-one, one-to-many
 */
var SendMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(SendMsg, _BaseMsg);

  var _super = _createSuper(SendMsg);

  function SendMsg(sender, outputs) {
    var _this;

    (0, _classCallCheck2["default"])(this, SendMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sender", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "outputs", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "aminoPrefix", _tx.AminoPrefix.MsgSend);
    _this.sender = sender;
    _this.outputs = outputs;
    return _this;
  }

  (0, _createClass2["default"])(SendMsg, [{
    key: "calInputCoins",
    value: function calInputCoins(inputsCoins, coins) {
      coins.forEach(function (coin) {
        var existCoin = inputsCoins.find(function (c) {
          return c.denom === coin.denom;
        });

        if (existCoin) {
          var existAmount = new _big["default"](existCoin.amount);
          existCoin.amount = Number(existAmount.plus(coin.amount).toString());
        } else {
          inputsCoins.push(_objectSpread({}, coin));
        }
      });
    }
  }, {
    key: "getSignMsg",
    value: function getSignMsg() {
      var _this2 = this;

      var signMsg = {
        inputs: [{
          address: this.sender,
          coins: []
        }],
        outputs: this.outputs
      };
      this.outputs.forEach(function (item) {
        _this2.calInputCoins(signMsg.inputs[0].coins, item.coins);
      });
      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var _this3 = this;

      var msg = {
        inputs: [{
          address: crypto.decodeAddress(this.sender),
          coins: []
        }],
        outputs: [],
        aminoPrefix: this.aminoPrefix
      };
      this.outputs.forEach(function (item) {
        _this3.calInputCoins(msg.inputs[0].coins, item.coins);

        var output = {
          address: crypto.decodeAddress(item.address),
          coins: item.coins
        };
        msg.outputs.push(output);
      });
      return msg;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        inputs: [{
          address: Buffer.from(""),
          coins: [{
            denom: "",
            amount: 0
          }]
        }],
        outputs: [{
          address: Buffer.from(""),
          coins: [{
            denom: "",
            amount: 0
          }]
        }],
        aminoPrefix: _tx.AminoPrefix.MsgSend
      };
    }
  }]);
  return SendMsg;
}(_.BaseMsg);

exports.SendMsg = SendMsg;