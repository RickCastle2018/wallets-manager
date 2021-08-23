"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stake = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _big = _interopRequireDefault(require("big.js"));

var crypto = _interopRequireWildcard(require("../../crypto"));

var _types = require("../../types");

/**
 * Stake
 */
var Stake = /*#__PURE__*/function () {
  /**
   * @param {BncClient} bncClient
   */
  function Stake(bncClient) {
    (0, _classCallCheck2["default"])(this, Stake);
    (0, _defineProperty2["default"])(this, "_bncClient", void 0);
    this._bncClient = bncClient;
  }

  (0, _createClass2["default"])(Stake, [{
    key: "bscDelegate",
    value: function () {
      var _bscDelegate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
        var delegateAddress, validatorAddress, amount, _ref$symbol, symbol, _ref$sideChainId, sideChainId, bscDelegateMsg;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                delegateAddress = _ref.delegateAddress, validatorAddress = _ref.validatorAddress, amount = _ref.amount, _ref$symbol = _ref.symbol, symbol = _ref$symbol === void 0 ? "BNB" : _ref$symbol, _ref$sideChainId = _ref.sideChainId, sideChainId = _ref$sideChainId === void 0 ? "chapel" : _ref$sideChainId;

                if (amount) {
                  _context.next = 3;
                  break;
                }

                throw new Error("amount should not be empty");

              case 3:
                if (delegateAddress) {
                  _context.next = 5;
                  break;
                }

                throw new Error("delegate address should not be null");

              case 5:
                if (crypto.checkAddress(validatorAddress, "bva")) {
                  _context.next = 7;
                  break;
                }

                throw new Error("validator address is not valid");

              case 7:
                amount = Number(new _big["default"](amount).mul(Math.pow(10, 8)).toString());
                bscDelegateMsg = new _types.BscDelegateMsg({
                  delegator_addr: delegateAddress,
                  validator_addr: validatorAddress,
                  delegation: {
                    denom: symbol,
                    amount: amount
                  },
                  side_chain_id: sideChainId
                });
                _context.next = 11;
                return this.broadcast(bscDelegateMsg, delegateAddress);

              case 11:
                return _context.abrupt("return", _context.sent);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function bscDelegate(_x) {
        return _bscDelegate.apply(this, arguments);
      }

      return bscDelegate;
    }()
  }, {
    key: "bscUndelegate",
    value: function () {
      var _bscUndelegate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
        var delegateAddress, validatorAddress, amount, _ref2$symbol, symbol, _ref2$sideChainId, sideChainId, unDelegateMsg;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                delegateAddress = _ref2.delegateAddress, validatorAddress = _ref2.validatorAddress, amount = _ref2.amount, _ref2$symbol = _ref2.symbol, symbol = _ref2$symbol === void 0 ? "BNB" : _ref2$symbol, _ref2$sideChainId = _ref2.sideChainId, sideChainId = _ref2$sideChainId === void 0 ? "chapel" : _ref2$sideChainId;

                if (amount) {
                  _context2.next = 3;
                  break;
                }

                throw new Error("amount should not be empty");

              case 3:
                if (delegateAddress) {
                  _context2.next = 5;
                  break;
                }

                throw new Error("delegate address should not be null");

              case 5:
                if (crypto.checkAddress(validatorAddress, "bva")) {
                  _context2.next = 7;
                  break;
                }

                throw new Error("validator address is not valid");

              case 7:
                amount = Number(new _big["default"](amount).mul(Math.pow(10, 8)).toString());
                unDelegateMsg = new _types.BscUndelegateMsg({
                  delegator_addr: delegateAddress,
                  validator_addr: validatorAddress,
                  amount: {
                    denom: symbol,
                    amount: amount
                  },
                  side_chain_id: sideChainId
                });
                _context2.next = 11;
                return this.broadcast(unDelegateMsg, delegateAddress);

              case 11:
                return _context2.abrupt("return", _context2.sent);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function bscUndelegate(_x2) {
        return _bscUndelegate.apply(this, arguments);
      }

      return bscUndelegate;
    }()
  }, {
    key: "bscReDelegate",
    value: function () {
      var _bscReDelegate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref3) {
        var delegateAddress, validatorSrcAddress, validatorDstAddress, amount, _ref3$symbol, symbol, _ref3$sideChainId, sideChainId, bscReDelegateMsg;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                delegateAddress = _ref3.delegateAddress, validatorSrcAddress = _ref3.validatorSrcAddress, validatorDstAddress = _ref3.validatorDstAddress, amount = _ref3.amount, _ref3$symbol = _ref3.symbol, symbol = _ref3$symbol === void 0 ? "BNB" : _ref3$symbol, _ref3$sideChainId = _ref3.sideChainId, sideChainId = _ref3$sideChainId === void 0 ? "chapel" : _ref3$sideChainId;

                if (amount) {
                  _context3.next = 3;
                  break;
                }

                throw new Error("amount should not be empty");

              case 3:
                if (delegateAddress) {
                  _context3.next = 5;
                  break;
                }

                throw new Error("delegate address should not be null");

              case 5:
                if (crypto.checkAddress(validatorSrcAddress, "bva")) {
                  _context3.next = 7;
                  break;
                }

                throw new Error("validator source address is not valid");

              case 7:
                if (crypto.checkAddress(validatorDstAddress, "bva")) {
                  _context3.next = 9;
                  break;
                }

                throw new Error("validator dest address is not valid");

              case 9:
                amount = Number(new _big["default"](amount).mul(Math.pow(10, 8)).toString());
                bscReDelegateMsg = new _types.BscReDelegateMsg({
                  delegator_addr: delegateAddress,
                  validator_src_addr: validatorSrcAddress,
                  validator_dst_addr: validatorDstAddress,
                  amount: {
                    denom: symbol,
                    amount: amount
                  },
                  side_chain_id: sideChainId
                });
                _context3.next = 13;
                return this.broadcast(bscReDelegateMsg, delegateAddress);

              case 13:
                return _context3.abrupt("return", _context3.sent);

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function bscReDelegate(_x3) {
        return _bscReDelegate.apply(this, arguments);
      }

      return bscReDelegate;
    }()
  }, {
    key: "broadcast",
    value: function () {
      var _broadcast = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(msg, fromAddress, sequence) {
        var signedTx;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._bncClient._prepareTransaction(msg.getMsg(), msg.getSignMsg(), fromAddress, sequence);

              case 2:
                signedTx = _context4.sent;
                return _context4.abrupt("return", this._bncClient._broadcastDelegate(signedTx));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function broadcast(_x4, _x5, _x6) {
        return _broadcast.apply(this, arguments);
      }

      return broadcast;
    }()
  }]);
  return Stake;
}();

exports.Stake = Stake;