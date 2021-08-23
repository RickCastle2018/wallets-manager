"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bridge = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _crypto = require("../../crypto");

var _types = require("../../types");

/**
 * Bridge
 */
var Bridge = /*#__PURE__*/function () {
  /**
   * @param {BncClient} bncClient
   */
  function Bridge(bncClient) {
    (0, _classCallCheck2["default"])(this, Bridge);
    (0, _defineProperty2["default"])(this, "_bncClient", void 0);
    this._bncClient = bncClient;
  }
  /**
   * transfer smart chain token to binance chain receiver
   */


  (0, _createClass2["default"])(Bridge, [{
    key: "transferIn",
    value: function () {
      var _transferIn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
        var sequence, contract_address, refund_addresses, receiver_addresses, amounts, relay_fee, expire_time, symbol, fromAddress, receiverAddresses, refundAddresses, claimHex;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                sequence = _ref.sequence, contract_address = _ref.contract_address, refund_addresses = _ref.refund_addresses, receiver_addresses = _ref.receiver_addresses, amounts = _ref.amounts, relay_fee = _ref.relay_fee, expire_time = _ref.expire_time, symbol = _ref.symbol, fromAddress = _ref.fromAddress;

                if (!(sequence < 0)) {
                  _context.next = 3;
                  break;
                }

                throw new Error("sequence should not be less than 0");

              case 3:
                if (contract_address) {
                  _context.next = 5;
                  break;
                }

                throw new Error("contract address should not be empty");

              case 5:
                if (relay_fee) {
                  _context.next = 7;
                  break;
                }

                throw new Error("relay fee should not be empty");

              case 7:
                if (symbol) {
                  _context.next = 9;
                  break;
                }

                throw new Error("symbol should not be null");

              case 9:
                if ((0, _crypto.checkAddress)(fromAddress, this._bncClient.addressPrefix)) {
                  _context.next = 11;
                  break;
                }

                throw new Error("fromAddress is not a valid Binance Chain address");

              case 11:
                if (!(refund_addresses.length != receiver_addresses.length || refund_addresses.length != amounts.length)) {
                  _context.next = 13;
                  break;
                }

                throw new Error("the length of refund address array, recipient address array and transfer amount array must be the same");

              case 13:
                receiverAddresses = receiver_addresses.map(function (address) {
                  var addressHrp = address.startsWith("tbnb") ? "tbnb" : "bnb";

                  if (!(0, _crypto.checkAddress)(address, addressHrp)) {
                    throw new Error("".concat(address, " in receiver_addresses is not a valid Binance Chain address"));
                  }

                  return (0, _crypto.decodeAddress)(address);
                });
                refundAddresses = refund_addresses.map(function (address) {
                  if (!address.startsWith("0x")) {
                    throw new Error("".concat(address, " is invalid"));
                  }

                  return Buffer.from(address.slice(2), "hex");
                });
                claimHex = Buffer.from(JSON.stringify({
                  contract_address: contract_address,
                  refund_addresses: refundAddresses,
                  receiver_addresses: receiverAddresses,
                  amounts: amounts,
                  symbol: symbol,
                  relay_fee: relay_fee,
                  expire_time: expire_time
                })).toString("hex");
                return _context.abrupt("return", this.buildClaimAndBroadcast({
                  claimHex: claimHex,
                  claim_type: _types.ClaimTypes.ClaimTypeTransferIn,
                  fromAddress: fromAddress,
                  sequence: sequence
                }));

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function transferIn(_x) {
        return _transferIn.apply(this, arguments);
      }

      return transferIn;
    }()
    /**
     * refund tokens to sender if transfer to smart chain failed
     */

  }, {
    key: "transferOutRefund",
    value: function () {
      var _transferOutRefund = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
        var transfer_out_sequence, refund_address, refund_reason, amount, fromAddress, claimHex;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                transfer_out_sequence = _ref2.transfer_out_sequence, refund_address = _ref2.refund_address, refund_reason = _ref2.refund_reason, amount = _ref2.amount, fromAddress = _ref2.fromAddress;

                if (!(transfer_out_sequence < 0)) {
                  _context2.next = 3;
                  break;
                }

                throw new Error("sequence should not be less than 0");

              case 3:
                if (amount) {
                  _context2.next = 5;
                  break;
                }

                throw new Error("amount should not be empty");

              case 5:
                if (refund_reason) {
                  _context2.next = 7;
                  break;
                }

                throw new Error("empty refund reason");

              case 7:
                if ((0, _crypto.checkAddress)(fromAddress, this._bncClient.addressPrefix)) {
                  _context2.next = 9;
                  break;
                }

                throw new Error("fromAddress is not a valid Binance Chain address");

              case 9:
                claimHex = Buffer.from(JSON.stringify({
                  transfer_out_sequence: transfer_out_sequence,
                  refund_address: refund_address,
                  amount: amount,
                  refund_reason: refund_reason
                })).toString("hex");
                return _context2.abrupt("return", this.buildClaimAndBroadcast({
                  claimHex: claimHex,
                  claim_type: _types.ClaimTypes.ClaimTypeTransferOutRefund,
                  sequence: transfer_out_sequence,
                  fromAddress: fromAddress
                }));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function transferOutRefund(_x2) {
        return _transferOutRefund.apply(this, arguments);
      }

      return transferOutRefund;
    }()
    /**
     * bind smart chain token to bep2 token
     */

  }, {
    key: "bind",
    value: function () {
      var _bind = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref3) {
        var contractAddress, contractDecimal, amount, symbol, expireTime, fromAddress, bindMsg;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                contractAddress = _ref3.contractAddress, contractDecimal = _ref3.contractDecimal, amount = _ref3.amount, symbol = _ref3.symbol, expireTime = _ref3.expireTime, fromAddress = _ref3.fromAddress;

                if ((0, _crypto.checkAddress)(fromAddress, this._bncClient.addressPrefix)) {
                  _context3.next = 3;
                  break;
                }

                throw new Error("fromAddress is not a valid Binance Chain address");

              case 3:
                if (contractAddress.startsWith("0x")) {
                  _context3.next = 5;
                  break;
                }

                throw new Error("contractAddress \"".concat(contractAddress, "\" is invalid"));

              case 5:
                bindMsg = new _types.BindMsg({
                  from: fromAddress,
                  amount: amount,
                  contract_address: contractAddress,
                  contract_decimals: contractDecimal,
                  expire_time: expireTime,
                  symbol: symbol
                });
                _context3.next = 8;
                return this.broadcast(bindMsg, fromAddress);

              case 8:
                return _context3.abrupt("return", _context3.sent);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function bind(_x3) {
        return _bind.apply(this, arguments);
      }

      return bind;
    }()
    /**
     * transfer token from Binance Chain to Binance Smart Chain
     */

  }, {
    key: "transferFromBcToBsc",
    value: function () {
      var _transferFromBcToBsc = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref4) {
        var toAddress, amount, symbol, expireTime, fromAddress, transferOut;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                toAddress = _ref4.toAddress, amount = _ref4.amount, symbol = _ref4.symbol, expireTime = _ref4.expireTime, fromAddress = _ref4.fromAddress;

                if ((0, _crypto.checkAddress)(fromAddress, this._bncClient.addressPrefix)) {
                  _context4.next = 3;
                  break;
                }

                throw new Error("fromAddress is not a valid Binance Chain address");

              case 3:
                if (toAddress.startsWith("0x")) {
                  _context4.next = 5;
                  break;
                }

                throw new Error("toAddress \"".concat(toAddress, "\" is invalid"));

              case 5:
                transferOut = new _types.TransferOutMsg({
                  from: fromAddress,
                  to: toAddress,
                  amount: {
                    denom: symbol,
                    amount: amount
                  },
                  expire_time: expireTime
                });
                return _context4.abrupt("return", this.broadcast(transferOut, fromAddress));

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function transferFromBcToBsc(_x4) {
        return _transferFromBcToBsc.apply(this, arguments);
      }

      return transferFromBcToBsc;
    }()
    /**
     * update bind request when events from smart chain received
     */

  }, {
    key: "upateBind",
    value: function () {
      var _upateBind = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref5) {
        var sequence, contract_address, symbol, status, fromAddress, claimHex;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                sequence = _ref5.sequence, contract_address = _ref5.contract_address, symbol = _ref5.symbol, status = _ref5.status, fromAddress = _ref5.fromAddress;

                if ((0, _crypto.checkAddress)(fromAddress, this._bncClient.addressPrefix)) {
                  _context5.next = 3;
                  break;
                }

                throw new Error("fromAddress is not a valid Binance Chain address");

              case 3:
                if (contract_address.startsWith("0x")) {
                  _context5.next = 5;
                  break;
                }

                throw new Error("toAddress \"".concat(contract_address, "\" is invalid"));

              case 5:
                claimHex = Buffer.from(JSON.stringify({
                  status: status,
                  symbol: symbol,
                  contract_address: contract_address
                })).toString("hex");
                return _context5.abrupt("return", this.buildClaimAndBroadcast({
                  claimHex: claimHex,
                  sequence: sequence,
                  fromAddress: fromAddress,
                  claim_type: _types.ClaimTypes.ClaimTypeUpdateBind
                }));

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function upateBind(_x5) {
        return _upateBind.apply(this, arguments);
      }

      return upateBind;
    }()
  }, {
    key: "skipSequence",
    value: function () {
      var _skipSequence = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref6) {
        var sequence, sequenceToSkip, fromAddress, claimHex;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                sequence = _ref6.sequence, sequenceToSkip = _ref6.sequenceToSkip, fromAddress = _ref6.fromAddress;

                if (!(sequence < 0)) {
                  _context6.next = 3;
                  break;
                }

                throw new Error("sequence should not be less than 0");

              case 3:
                if ((0, _crypto.checkAddress)(fromAddress, this._bncClient.addressPrefix)) {
                  _context6.next = 5;
                  break;
                }

                throw new Error("fromAddress is not a valid Binance Chain address");

              case 5:
                claimHex = Buffer.from(JSON.stringify({
                  claim_type: _types.ClaimTypes.ClaimTypeUpdateBind,
                  sequence: sequenceToSkip
                })).toString("hex");
                return _context6.abrupt("return", this.buildClaimAndBroadcast({
                  claimHex: claimHex,
                  sequence: sequence,
                  fromAddress: fromAddress,
                  claim_type: _types.ClaimTypes.ClaimTypeSkipSequence
                }));

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function skipSequence(_x6) {
        return _skipSequence.apply(this, arguments);
      }

      return skipSequence;
    }()
  }, {
    key: "buildClaimAndBroadcast",
    value: function () {
      var _buildClaimAndBroadcast = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_ref7) {
        var claimHex, claim_type, sequence, fromAddress, claimMsg;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                claimHex = _ref7.claimHex, claim_type = _ref7.claim_type, sequence = _ref7.sequence, fromAddress = _ref7.fromAddress;
                claimMsg = new _types.ClaimMsg({
                  claim_type: claim_type,
                  sequence: sequence,
                  claim: claimHex,
                  validator_address: fromAddress
                });
                _context7.next = 4;
                return this.broadcast(claimMsg, fromAddress, sequence);

              case 4:
                return _context7.abrupt("return", _context7.sent);

              case 5:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function buildClaimAndBroadcast(_x7) {
        return _buildClaimAndBroadcast.apply(this, arguments);
      }

      return buildClaimAndBroadcast;
    }()
  }, {
    key: "broadcast",
    value: function () {
      var _broadcast = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(msg, fromAddress, sequence) {
        var signedTx;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this._bncClient._prepareTransaction(msg.getMsg(), msg.getSignMsg(), fromAddress, sequence);

              case 2:
                signedTx = _context8.sent;
                return _context8.abrupt("return", this._bncClient._broadcastDelegate(signedTx));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function broadcast(_x8, _x9, _x10) {
        return _broadcast.apply(this, arguments);
      }

      return broadcast;
    }()
  }]);
  return Bridge;
}();

exports.Bridge = Bridge;