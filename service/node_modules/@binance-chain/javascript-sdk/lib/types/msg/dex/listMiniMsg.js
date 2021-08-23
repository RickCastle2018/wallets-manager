"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListMiniMsg = void 0;

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

var ListMiniMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(ListMiniMsg, _BaseMsg);

  var _super = _createSuper(ListMiniMsg);

  function ListMiniMsg(_ref) {
    var _this;

    var from = _ref.from,
        base_asset_symbol = _ref.base_asset_symbol,
        quote_asset_symbol = _ref.quote_asset_symbol,
        init_price = _ref.init_price;
    (0, _classCallCheck2["default"])(this, ListMiniMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "from", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "base_asset_symbol", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "quote_asset_symbol", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "init_price", void 0);
    _this.from = from;
    _this.base_asset_symbol = base_asset_symbol;
    _this.quote_asset_symbol = quote_asset_symbol;
    _this.init_price = init_price;
    return _this;
  }

  (0, _createClass2["default"])(ListMiniMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var signMsg = {
        from: this.from,
        base_asset_symbol: this.base_asset_symbol,
        quote_asset_symbol: this.quote_asset_symbol,
        init_price: this.init_price
      };
      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        from: crypto.decodeAddress(this.from),
        base_asset_symbol: this.base_asset_symbol,
        quote_asset_symbol: this.quote_asset_symbol,
        init_price: this.init_price,
        aminoPrefix: _tx.AminoPrefix.ListMiniMsg
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        from: Buffer.from(""),
        base_asset_symbol: "",
        quote_asset_symbol: "",
        init_price: 0,
        aminoPrefix: _tx.AminoPrefix.ListMiniMsg
      };
    }
  }]);
  return ListMiniMsg;
}(_base.BaseMsg);

exports.ListMiniMsg = ListMiniMsg;