"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubmitProposalMsg = exports.OrderBook = exports.OrderBookLevel = exports.TradingPair = exports.OpenOrder = exports.TokenBalance = exports.AppAccount = exports.BaseAccount = exports.TokenOfList = exports.Token = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _tx = require("../tx");

var Token = function Token() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, Token);
  (0, _defineProperty2["default"])(this, "aminoPrefix", _tx.AminoPrefix.BnbchainToken);
  (0, _defineProperty2["default"])(this, "name", void 0);
  (0, _defineProperty2["default"])(this, "symbol", void 0);
  (0, _defineProperty2["default"])(this, "original_symbol", void 0);
  (0, _defineProperty2["default"])(this, "total_supply", void 0);
  (0, _defineProperty2["default"])(this, "owner", void 0);
  (0, _defineProperty2["default"])(this, "mintable", void 0);
  this.name = opts.name || "";
  this.symbol = opts.symbol || "";
  this.original_symbol = opts.original_symbol || "";
  this.total_supply = opts.total_supply || 0;
  this.owner = opts.owner || Buffer.alloc(0);
  this.mintable = opts.mintable || false;
};

exports.Token = Token;

var TokenOfList = function TokenOfList() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, TokenOfList);
  (0, _defineProperty2["default"])(this, "name", void 0);
  (0, _defineProperty2["default"])(this, "symbol", void 0);
  (0, _defineProperty2["default"])(this, "original_symbol", void 0);
  (0, _defineProperty2["default"])(this, "total_supply", void 0);
  (0, _defineProperty2["default"])(this, "owner", void 0);
  (0, _defineProperty2["default"])(this, "mintable", void 0);
  this.name = opts.name || "";
  this.symbol = opts.symbol || "";
  this.original_symbol = opts.original_symbol || "";
  this.total_supply = opts.total_supply || 0;
  this.owner = opts.owner || Buffer.alloc(0);
  this.mintable = opts.mintable || false;
};

exports.TokenOfList = TokenOfList;

var BaseAccount = function BaseAccount() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, BaseAccount);
  (0, _defineProperty2["default"])(this, "address", void 0);
  (0, _defineProperty2["default"])(this, "coins", void 0);
  (0, _defineProperty2["default"])(this, "public_key", void 0);
  (0, _defineProperty2["default"])(this, "account_number", void 0);
  (0, _defineProperty2["default"])(this, "sequence", void 0);
  this.address = opts.address || Buffer.alloc(0);
  this.coins = opts.coins || [{
    denom: "",
    amount: 0
  }];
  this.public_key = opts.public_key || Buffer.alloc(0);
  this.account_number = opts.account_number || 0;
  this.sequence = opts.sequence || 0;
};

exports.BaseAccount = BaseAccount;

var AppAccount = function AppAccount() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, AppAccount);
  (0, _defineProperty2["default"])(this, "aminoPrefix", _tx.AminoPrefix.BnbchainAccount);
  (0, _defineProperty2["default"])(this, "base", void 0);
  (0, _defineProperty2["default"])(this, "name", void 0);
  (0, _defineProperty2["default"])(this, "locked", void 0);
  (0, _defineProperty2["default"])(this, "frozen", void 0);
  this.base = opts.base || new BaseAccount();
  this.name = opts.name || "";
  this.locked = opts.locked || [{
    denom: "",
    amount: 0
  }];
  this.frozen = opts.frozen || [{
    denom: "",
    amount: 0
  }];
};

exports.AppAccount = AppAccount;

var TokenBalance = function TokenBalance() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, TokenBalance);
  (0, _defineProperty2["default"])(this, "symbol", void 0);
  (0, _defineProperty2["default"])(this, "free", void 0);
  (0, _defineProperty2["default"])(this, "locked", void 0);
  (0, _defineProperty2["default"])(this, "frozen", void 0);
  this.symbol = opts.symbol || "";
  this.free = opts.free || 0;
  this.locked = opts.locked || 0;
  this.frozen = opts.frozen || 0;
};

exports.TokenBalance = TokenBalance;

var OpenOrder = function OpenOrder() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, OpenOrder);
  (0, _defineProperty2["default"])(this, "id", void 0);
  (0, _defineProperty2["default"])(this, "symbol", void 0);
  (0, _defineProperty2["default"])(this, "price", void 0);
  (0, _defineProperty2["default"])(this, "quantity", void 0);
  (0, _defineProperty2["default"])(this, "cumQty", void 0);
  (0, _defineProperty2["default"])(this, "createdHeight", void 0);
  (0, _defineProperty2["default"])(this, "createdTimestamp", void 0);
  (0, _defineProperty2["default"])(this, "lastUpdatedHeight", void 0);
  (0, _defineProperty2["default"])(this, "lastUpdatedTimestamp", void 0);
  this.id = opts.id || "";
  this.symbol = opts.symbol || "";
  this.price = opts.price || 0;
  this.quantity = opts.quantity || 0;
  this.cumQty = opts.cumQty || 0;
  this.createdHeight = opts.createdHeight || 0;
  this.createdTimestamp = opts.createdTimestamp || 0;
  this.lastUpdatedHeight = opts.lastUpdatedHeight || 0;
  this.lastUpdatedTimestamp = opts.lastUpdatedTimestamp || 0;
};

exports.OpenOrder = OpenOrder;

var TradingPair = function TradingPair() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, TradingPair);
  (0, _defineProperty2["default"])(this, "base_asset_symbol", void 0);
  (0, _defineProperty2["default"])(this, "quote_asset_symbol", void 0);
  (0, _defineProperty2["default"])(this, "list_price", void 0);
  (0, _defineProperty2["default"])(this, "tick_size", void 0);
  (0, _defineProperty2["default"])(this, "lot_size", void 0);
  this.base_asset_symbol = opts.base_asset_symbol || "";
  this.quote_asset_symbol = opts.quote_asset_symbol || "";
  this.list_price = opts.list_price || 0;
  this.tick_size = opts.tick_size || 0;
  this.lot_size = opts.lot_size || 0;
};

exports.TradingPair = TradingPair;

var OrderBookLevel = function OrderBookLevel() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, OrderBookLevel);
  (0, _defineProperty2["default"])(this, "buyQty", void 0);
  (0, _defineProperty2["default"])(this, "buyPrice", void 0);
  (0, _defineProperty2["default"])(this, "sellQty", void 0);
  (0, _defineProperty2["default"])(this, "sellPrice", void 0);
  this.buyQty = opts.buyQty || 0;
  this.buyPrice = opts.buyPrice || 0;
  this.sellQty = opts.sellQty || 0;
  this.sellPrice = opts.sellPrice || 0;
};

exports.OrderBookLevel = OrderBookLevel;

var OrderBook = function OrderBook() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, OrderBook);
  (0, _defineProperty2["default"])(this, "height", void 0);
  (0, _defineProperty2["default"])(this, "levels", void 0);
  this.height = opts.height || 0;
  this.levels = opts.levels || [new OrderBookLevel()];
};

exports.OrderBook = OrderBook;

var SubmitProposalMsg = function SubmitProposalMsg() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, SubmitProposalMsg);
  (0, _defineProperty2["default"])(this, "aminoPrefix", _tx.AminoPrefix.MsgSubmitProposal);
  (0, _defineProperty2["default"])(this, "title", void 0);
  (0, _defineProperty2["default"])(this, "description", void 0);
  (0, _defineProperty2["default"])(this, "proposal_type", void 0);
  (0, _defineProperty2["default"])(this, "proposer", void 0);
  (0, _defineProperty2["default"])(this, "initial_deposit", void 0);
  (0, _defineProperty2["default"])(this, "voting_period", void 0);
  opts = opts || {};
  this.title = opts.title || "";
  this.description = opts.description || "";
  this.proposal_type = opts.proposal_type || 0;
  this.proposer = opts.proposer || Buffer.alloc(0);
  this.initial_deposit = opts.initial_deposit || [];
  this.voting_period = opts.voting_period || 0;
};

exports.SubmitProposalMsg = SubmitProposalMsg;