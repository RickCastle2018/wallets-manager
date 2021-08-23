"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BscReDelegateMsg = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require("..");

var crypto = _interopRequireWildcard(require("../../../crypto"));

var _tx = require("../../tx");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var BscReDelegateMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(BscReDelegateMsg, _BaseMsg);

  var _super = _createSuper(BscReDelegateMsg);

  function BscReDelegateMsg(_ref) {
    var _this;

    var delegator_addr = _ref.delegator_addr,
        validator_src_addr = _ref.validator_src_addr,
        validator_dst_addr = _ref.validator_dst_addr,
        amount = _ref.amount,
        side_chain_id = _ref.side_chain_id;
    (0, _classCallCheck2["default"])(this, BscReDelegateMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "delegator_addr", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "validator_src_addr", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "validator_dst_addr", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "amount", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "side_chain_id", void 0);
    _this.delegator_addr = delegator_addr;
    _this.validator_src_addr = validator_src_addr;
    _this.validator_dst_addr = validator_dst_addr;
    _this.amount = amount;
    _this.side_chain_id = side_chain_id;
    return _this;
  }

  (0, _createClass2["default"])(BscReDelegateMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var _this$amount = this.amount,
          denom = _this$amount.denom,
          amount = _this$amount.amount;
      var signMsg = {
        delegator_addr: this.delegator_addr,
        validator_src_addr: this.validator_src_addr,
        validator_dst_addr: this.validator_dst_addr,
        amount: {
          denom: denom,
          amount: String(amount)
        },
        side_chain_id: this.side_chain_id
      };
      return {
        type: "cosmos-sdk/MsgSideChainRedelegate",
        value: signMsg
      };
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        delegator_addr: crypto.decodeAddress(this.delegator_addr),
        validator_src_addr: crypto.decodeAddress(this.validator_src_addr),
        validator_dst_addr: crypto.decodeAddress(this.validator_dst_addr),
        amount: this.amount,
        side_chain_id: this.side_chain_id,
        aminoPrefix: _tx.AminoPrefix.MsgSideChainRedelegate
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        delegator_addr: Buffer.from(""),
        validator_src_addr: Buffer.from(""),
        validator_dst_addr: Buffer.from(""),
        amount: [{
          denom: "",
          amount: 0
        }],
        side_chain_id: "",
        aminoPrefix: _tx.AminoPrefix.MsgSideChainRedelegate
      };
    }
  }]);
  return BscReDelegateMsg;
}(_.BaseMsg);

exports.BscReDelegateMsg = BscReDelegateMsg;