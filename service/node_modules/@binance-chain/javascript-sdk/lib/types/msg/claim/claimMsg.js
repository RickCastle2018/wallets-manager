"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClaimMsg = void 0;

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

var _claimTypes = require("./claimTypes");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ClaimMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(ClaimMsg, _BaseMsg);

  var _super = _createSuper(ClaimMsg);

  function ClaimMsg(_ref) {
    var _this;

    var claim_type = _ref.claim_type,
        sequence = _ref.sequence,
        claim = _ref.claim,
        validator_address = _ref.validator_address;
    (0, _classCallCheck2["default"])(this, ClaimMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "claim_type", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sequence", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "claim", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "validator_address", void 0);
    _this.claim_type = claim_type;
    _this.sequence = sequence;
    _this.claim = claim;
    _this.validator_address = validator_address;
    return _this;
  }

  (0, _createClass2["default"])(ClaimMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      return {
        claim_type: this.claim_type,
        sequence: this.sequence,
        claim: this.claim,
        validator_address: this.validator_address
      };
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      return {
        claim_type: this.claim_type,
        sequence: this.sequence,
        claim: this.claim,
        validator_address: crypto.decodeAddress(this.validator_address),
        aminoPrefix: _tx.AminoPrefix.ClaimMsg
      };
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        claim_type: _claimTypes.ClaimTypes.ClaimTypeSkipSequence,
        sequence: 0,
        claim: "",
        validator_address: Buffer.from(""),
        aminoPrefix: _tx.AminoPrefix.ClaimMsg
      };
    }
  }]);
  return ClaimMsg;
}(_.BaseMsg);

exports.ClaimMsg = ClaimMsg;