"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _big = require("big.js");

var _amino = require("../amino");

var crypto = _interopRequireWildcard(require("../crypto"));

var _types = require("../types");

var _utils = require("../utils");

var _baseRpc = _interopRequireDefault(require("./baseRpc"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * The Binance Chain Node rpc client
 */
var RpcClient = /*#__PURE__*/function (_BaseRpc) {
  (0, _inherits2["default"])(RpcClient, _BaseRpc);

  var _super = _createSuper(RpcClient);

  /**
   * @param {String} uriString dataseed address
   * @param {String} netWork Binance Chain network
   */
  function RpcClient() {
    var _this;

    var uriString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "localhost:27146";
    var netWork = arguments.length > 1 ? arguments[1] : undefined;
    (0, _classCallCheck2["default"])(this, RpcClient);
    _this = _super.call(this, uriString);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "netWork", void 0);
    _this.netWork = netWork || "mainnet";
    return _this;
  }
  /**
   * The RPC broadcast delegate broadcasts a transaction via RPC. This is intended for optional use as BncClient's broadcast delegate.
   * @param {Transaction} signedTx the signed transaction
   * @return {Promise}
   */


  (0, _createClass2["default"])(RpcClient, [{
    key: "broadcastDelegate",
    value: function () {
      var _broadcastDelegate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(signedTx) {
        var encoded, res;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // amino encode the signed TX
                encoded = signedTx.serialize(); // broadcast it via RPC; we have to use a promise here because that's
                // what the BncClient expects as the return value of this function.

                _context.next = 3;
                return this.broadcastTxSync({
                  tx: Buffer.from(encoded, "hex")
                });

              case 3:
                res = _context.sent;

                if (!("".concat(res.code) === "0")) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", res);

              case 8:
                throw new Error("broadcastDelegate: non-zero status code ".concat(res.code));

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function broadcastDelegate(_x) {
        return _broadcastDelegate.apply(this, arguments);
      }

      return broadcastDelegate;
    }()
  }, {
    key: "getBech32Prefix",
    value: function getBech32Prefix() {
      if (this.netWork === "mainnet") {
        return "bnb";
      }

      if (this.netWork === "testnet") {
        return "tbnb";
      }

      return "";
    }
    /**
     * @param {String} symbol - required
     * @returns {Object} token detail info
     */

  }, {
    key: "getTokenInfo",
    value: function () {
      var _getTokenInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(symbol) {
        var path, res, bytes, tokenInfo, bech32Prefix, ownerAddress;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                (0, _utils.validateSymbol)(symbol);
                path = "/tokens/info/" + symbol;
                _context2.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context2.sent;
                bytes = Buffer.from(res.response.value, "base64");
                tokenInfo = new _types.Token();
                (0, _amino.unMarshalBinaryLengthPrefixed)(bytes, tokenInfo);
                bech32Prefix = this.getBech32Prefix();
                ownerAddress = crypto.encodeAddress(tokenInfo.owner, bech32Prefix);
                delete tokenInfo.aminoPrefix; //TODO all the result contains aminoPrefix, need to improve

                return _context2.abrupt("return", _objectSpread(_objectSpread({}, tokenInfo), {}, {
                  owner: ownerAddress
                }));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTokenInfo(_x2) {
        return _getTokenInfo.apply(this, arguments);
      }

      return getTokenInfo;
    }()
    /**
     * get tokens by offset and limit
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array} token list
     */

  }, {
    key: "listAllTokens",
    value: function () {
      var _listAllTokens = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(offset, limit) {
        var _this2 = this;

        var path, res, bytes, tokenArr, _unMarshalBinaryLengt, tokenList;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                (0, _utils.validateOffsetLimit)(offset, limit);
                path = "tokens/list/".concat(offset, "/").concat(limit);
                _context3.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context3.sent;
                bytes = Buffer.from(res.response.value, "base64");
                tokenArr = [new _types.TokenOfList()];
                _unMarshalBinaryLengt = (0, _amino.unMarshalBinaryLengthPrefixed)(bytes, tokenArr), tokenList = _unMarshalBinaryLengt.val;
                (0, _amino.unMarshalBinaryLengthPrefixed)(bytes, tokenList);
                return _context3.abrupt("return", tokenList.map(function (item) {
                  return _objectSpread(_objectSpread({}, item), {}, {
                    owner: crypto.encodeAddress(item.owner, _this2.getBech32Prefix())
                  });
                }));

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function listAllTokens(_x3, _x4) {
        return _listAllTokens.apply(this, arguments);
      }

      return listAllTokens;
    }()
    /**
     * @param {String} address
     * @returns {Object} Account info
     */

  }, {
    key: "getAccount",
    value: function () {
      var _getAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(address) {
        var res, accountInfo, bytes, bech32Prefix;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.abciQuery({
                  path: "/account/".concat(address)
                });

              case 2:
                res = _context4.sent;
                accountInfo = new _types.AppAccount();
                bytes = Buffer.from(res.response.value, "base64");
                (0, _amino.unMarshalBinaryBare)(bytes, accountInfo);
                bech32Prefix = this.getBech32Prefix();
                return _context4.abrupt("return", {
                  name: accountInfo.name,
                  locked: accountInfo.locked,
                  frozen: accountInfo.frozen,
                  base: _objectSpread(_objectSpread({}, accountInfo.base), {}, {
                    address: crypto.encodeAddress(accountInfo.base.address, bech32Prefix)
                  })
                });

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getAccount(_x5) {
        return _getAccount.apply(this, arguments);
      }

      return getAccount;
    }()
    /**
     * @param {Array} balances
     */

  }, {
    key: "getBalances",
    value: function () {
      var _getBalances = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(address) {
        var account, coins, balances;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getAccount(address);

              case 2:
                account = _context5.sent;
                coins = [];
                balances = [];

                if (account) {
                  coins = account.base && account.base.coins || [];
                  (0, _utils.convertObjectArrayNum)(coins, ["amount"]);
                  (0, _utils.convertObjectArrayNum)(account.locked, ["amount"]);
                  (0, _utils.convertObjectArrayNum)(account.frozen, ["amount"]);
                }

                coins.forEach(function (item) {
                  var locked = account.locked.find(function (lockedItem) {
                    return item.denom === lockedItem.denom;
                  }) || {};
                  var frozen = account.frozen.find(function (frozenItem) {
                    return item.denom === frozenItem.denom;
                  }) || {};
                  var bal = new _types.TokenBalance();
                  bal.symbol = item.denom;
                  bal.free = +new _big.Big(item.amount).toString();
                  bal.locked = locked.amount || 0;
                  bal.frozen = frozen.amount || 0;
                  balances.push(bal);
                });
                return _context5.abrupt("return", balances);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getBalances(_x6) {
        return _getBalances.apply(this, arguments);
      }

      return getBalances;
    }()
    /**
     * get balance by symbol and address
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */

  }, {
    key: "getBalance",
    value: function () {
      var _getBalance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(address, symbol) {
        var balances, bal;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                (0, _utils.validateSymbol)(symbol);
                _context6.next = 3;
                return this.getBalances(address);

              case 3:
                balances = _context6.sent;
                bal = balances.find(function (item) {
                  return item.symbol.toUpperCase() === symbol.toUpperCase();
                });
                return _context6.abrupt("return", bal);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getBalance(_x7, _x8) {
        return _getBalance.apply(this, arguments);
      }

      return getBalance;
    }()
    /**
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */

  }, {
    key: "getOpenOrders",
    value: function () {
      var _getOpenOrders = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(address, symbol) {
        var path, res, bytes, result, _unMarshalBinaryLengt2, openOrders;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                path = "/dex/openorders/".concat(symbol, "/").concat(address);
                _context7.next = 3;
                return this.abciQuery({
                  path: path
                });

              case 3:
                res = _context7.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = [new _types.OpenOrder()];
                _unMarshalBinaryLengt2 = (0, _amino.unMarshalBinaryLengthPrefixed)(bytes, result), openOrders = _unMarshalBinaryLengt2.val;
                (0, _utils.convertObjectArrayNum)(openOrders, ["price", "quantity", "cumQty"]);
                return _context7.abrupt("return", openOrders);

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getOpenOrders(_x9, _x10) {
        return _getOpenOrders.apply(this, arguments);
      }

      return getOpenOrders;
    }()
    /**
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array}
     */

  }, {
    key: "getTradingPairs",
    value: function () {
      var _getTradingPairs = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(offset, limit) {
        var path, res, bytes, result, _unMarshalBinaryLengt3, tradingPairs;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                (0, _utils.validateOffsetLimit)(offset, limit);
                path = "/dex/pairs/".concat(offset, "/").concat(limit);
                _context8.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context8.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = [new _types.TradingPair()];
                _unMarshalBinaryLengt3 = (0, _amino.unMarshalBinaryLengthPrefixed)(bytes, result), tradingPairs = _unMarshalBinaryLengt3.val;
                (0, _utils.convertObjectArrayNum)(tradingPairs, ["list_price", "tick_size", "lot_size"]);
                return _context8.abrupt("return", tradingPairs);

              case 10:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getTradingPairs(_x11, _x12) {
        return _getTradingPairs.apply(this, arguments);
      }

      return getTradingPairs;
    }()
    /**
     * @param {String} tradePair
     * @returns {Array}
     */

  }, {
    key: "getDepth",
    value: function () {
      var _getDepth = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(tradePair) {
        var path, res, bytes, result, _unMarshalBinaryLengt4, depth;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                (0, _utils.validateTradingPair)(tradePair);
                path = "dex/orderbook/".concat(tradePair);
                _context9.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context9.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = new _types.OrderBook();
                _unMarshalBinaryLengt4 = (0, _amino.unMarshalBinaryLengthPrefixed)(bytes, result), depth = _unMarshalBinaryLengt4.val;
                (0, _utils.convertObjectArrayNum)(depth.levels, ["buyQty", "buyPrice", "sellQty", "sellPrice"]);
                return _context9.abrupt("return", depth);

              case 10:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getDepth(_x13) {
        return _getDepth.apply(this, arguments);
      }

      return getDepth;
    }()
  }, {
    key: "getTxByHash",
    value: function () {
      var _getTxByHash = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(hash) {
        var prove,
            res,
            txBytes,
            msgAminoPrefix,
            msgType,
            type,
            _unMarshalBinaryLengt5,
            result,
            txResult,
            _args10 = arguments;

        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                prove = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : true;

                if (!Buffer.isBuffer(hash)) {
                  hash = Buffer.from(hash, "hex");
                }

                _context10.next = 4;
                return this.tx({
                  hash: hash,
                  prove: prove
                });

              case 4:
                res = _context10.sent;
                txBytes = Buffer.from(res.tx, "base64");
                msgAminoPrefix = txBytes.slice(8, 12).toString("hex");
                msgType = (0, _utils.getMsgByAminoPrefix)(msgAminoPrefix);
                type = {
                  msg: [msgType.defaultMsg()],
                  signatures: [{
                    pub_key: Buffer.from(""),
                    signature: Buffer.from(""),
                    account_number: 0,
                    sequence: 0
                  }],
                  memo: "",
                  source: 0,
                  data: "",
                  aminoPrefix: _types.AminoPrefix.StdTx
                };
                _unMarshalBinaryLengt5 = (0, _amino.unMarshalBinaryLengthPrefixed)(txBytes, type), result = _unMarshalBinaryLengt5.val;
                txResult = this.parseTxResult(res.tx_result); //TODO remove aminoPrefix

                return _context10.abrupt("return", _objectSpread(_objectSpread({}, res), {}, {
                  tx: result,
                  tx_result: txResult
                }));

              case 12:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getTxByHash(_x14) {
        return _getTxByHash.apply(this, arguments);
      }

      return getTxByHash;
    }()
  }, {
    key: "parseTxResult",
    value: function parseTxResult(txResult) {
      if (txResult.data) {
        txResult.data = Buffer.from(txResult.data, "base64").toString();
      }

      if (txResult.events && txResult.events.length > 0) {
        for (var i = 0; i < txResult.events.length; i++) {
          var event = txResult.events[i];

          if (event.attributes && event.attributes.length > 0) {
            event.attributes = event.attributes.map(function (item) {
              return {
                key: Buffer.from(item.key, "base64").toString(),
                value: Buffer.from(item.value, "base64").toString()
              };
            });
          }
        }
      }

      if (txResult.tags && txResult.tags.length > 0) {
        txResult.tags = txResult.tags.map(function (item) {
          return {
            key: Buffer.from(item.key, "base64").toString(),
            value: Buffer.from(item.value, "base64").toString()
          };
        });
      }

      return _objectSpread({}, txResult);
    }
  }]);
  return RpcClient;
}(_baseRpc["default"]);

var _default = RpcClient;
exports["default"] = _default;