"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubmitProposalMsg = void 0;

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

var proposalTypeMapping = {
  0x04: "ListTradingPair",
  0x00: "Nil",
  0x01: "Text",
  0x02: "ParameterChange",
  0x03: "SoftwareUpgrade",
  0x05: "FeeChange",
  0x06: "CreateValidator",
  0x07: "RemoveValidator"
};

var SubmitProposalMsg = /*#__PURE__*/function (_BaseMsg) {
  (0, _inherits2["default"])(SubmitProposalMsg, _BaseMsg);

  var _super = _createSuper(SubmitProposalMsg);

  function SubmitProposalMsg(_ref) {
    var _this;

    var address = _ref.address,
        title = _ref.title,
        proposal_type = _ref.proposal_type,
        initialDeposit = _ref.initialDeposit,
        voting_period = _ref.voting_period,
        description = _ref.description;
    (0, _classCallCheck2["default"])(this, SubmitProposalMsg);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "title", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "description", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "proposal_type", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "address", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "initialDeposit", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "voting_period", void 0);
    _this.address = address;
    _this.title = title;
    _this.proposal_type = proposal_type;
    _this.initialDeposit = initialDeposit;
    _this.voting_period = voting_period;
    _this.description = description;
    return _this;
  }

  (0, _createClass2["default"])(SubmitProposalMsg, [{
    key: "getSignMsg",
    value: function getSignMsg() {
      var signMsg = {
        title: this.title,
        description: this.description,
        proposal_type: proposalTypeMapping[this.proposal_type],
        proposer: this.address,
        voting_period: this.voting_period.toString(),
        initial_deposit: [{
          denom: "BNB",
          amount: new Big(this.initialDeposit).mul(Math.pow(10, 8)).toString()
        }]
      };
      return signMsg;
    }
  }, {
    key: "getMsg",
    value: function getMsg() {
      var data = {
        title: this.title,
        description: this.description,
        proposal_type: this.proposal_type,
        proposer: crypto.decodeAddress(this.address),
        initial_deposit: [{
          denom: "BNB",
          amount: +new Big(this.initialDeposit).mul(Math.pow(10, 8)).toString()
        }],
        voting_period: this.voting_period,
        aminoPrefix: _tx.AminoPrefix.MsgSubmitProposal
      };
      return data;
    }
  }], [{
    key: "defaultMsg",
    value: function defaultMsg() {
      return {
        title: "",
        description: "",
        propsal_type: 0,
        proposer: Buffer.from(""),
        inital_deposit: [{
          denom: "",
          amount: 0
        }],
        voting_period: 0,
        aminoPrefix: _tx.AminoPrefix.MsgSubmitProposal
      };
    }
  }]);
  return SubmitProposalMsg;
}(_.BaseMsg);

exports.SubmitProposalMsg = SubmitProposalMsg;