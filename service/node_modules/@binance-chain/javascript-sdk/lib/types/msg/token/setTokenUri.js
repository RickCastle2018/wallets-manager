"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetTokenUriMsg = void 0;

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

var SetTokenUriMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(SetTokenUriMsg, _BaseMsg);

  var _super = _createSuper(SetTokenUriMsg);

  function SetTokenUriMsg(_ref) {
    var _this;

    var from = _ref.from,
        symbol = _ref.symbol,
        token_uri = _ref.token_uri;
    (0, _classCallCheck2["default"])(this, SetTokenUriMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "from", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "symbol", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "token_uri", void 0);
    _this.from = from;
    _this.symbol = symbol;
    _this.token_uri = token_uri;
    return _this;
  }

  (0, _createClass2["default"])(SetTokenUriMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var signMsg = {
        from: this.from,
        symbol: this.symbol,
        token_uri: this.token_uri
      };
      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        from: crypto.decodeAddress(this.from),
        symbol: this.symbol,
        token_uri: this.token_uri,
        aminoPrefix: _tx.AminoPrefix.SetURIMsg
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        from: Buffer.from(""),
        symbol: "",
        token_uri: "",
        aminoPrefix: _tx.AminoPrefix.SetURIMsg
      };
    }
  }]);
  return SetTokenUriMsg;
}(_.BaseMsg);

exports.SetTokenUriMsg = SetTokenUriMsg;