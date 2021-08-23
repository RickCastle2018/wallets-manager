"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _events = require("events");

var _is_js = _interopRequireDefault(require("is_js"));

var _ndjson = _interopRequireDefault(require("ndjson"));

var _pumpify = _interopRequireDefault(require("pumpify"));

var _url = _interopRequireDefault(require("url"));

var _websocketStream = _interopRequireDefault(require("websocket-stream"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function convertHttpArgs(url) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var search = [];

  for (var _k in args) {
    if (_is_js["default"].string(args[_k])) {
      search.push("".concat(_k, "=\"").concat(args[_k], "\""));
    } else if (Buffer.isBuffer(args[_k])) {
      search.push("".concat(_k, "=0x").concat(args[_k].toString("hex")));
    } else {
      search.push("".concat(_k, "=").concat(args[_k]));
    }
  }

  return "".concat(url, "?").concat(search.join("&"));
}

function convertWsArgs() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  for (var _k2 in args) {
    var v = args[_k2];

    if (typeof v === "number") {
      args[_k2] = String(v);
    } else if (Buffer.isBuffer(v)) {
      args[_k2] = "0x" + v.toString("hex");
    } else if (v instanceof Uint8Array) {
      args[_k2] = "0x" + Buffer.from(v).toString("hex");
    }
  }

  return args;
}

var wsProtocols = ["ws:", "wss:"];
var httpProtocols = ["http:", "https:"];
var allProtocols = wsProtocols.concat(httpProtocols);

var BaseRpc = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(BaseRpc, _EventEmitter);

  var _super = _createSuper(BaseRpc);

  function BaseRpc() {
    var _this;

    var uriString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "localhost:27146";
    (0, _classCallCheck2["default"])(this, BaseRpc);
    _this = _super.call(this); // parse full-node URI

    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "uri", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "call", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "closed", false);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ws", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "createCallBasedMethod", function (name) {
      return function (args, listener) {
        return _this.call(name, args, listener).then(function (res) {
          return res;
        });
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "subscribe", _this.createCallBasedMethod("subscribe"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "unsubscribe", _this.createCallBasedMethod("unsubscribe"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "unsubscribeAll", _this.createCallBasedMethod("unsubscribe_all"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "status", _this.createCallBasedMethod("status"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "netInfo", _this.createCallBasedMethod("net_info"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "blockchain", _this.createCallBasedMethod("blockchain"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "genesis", _this.createCallBasedMethod("genesis"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "health", _this.createCallBasedMethod("health"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "block", _this.createCallBasedMethod("block"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "blockResults", _this.createCallBasedMethod("block_results"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "validators", _this.createCallBasedMethod("validators"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "consensusState", _this.createCallBasedMethod("consensus_state"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "dumpConsensusState", _this.createCallBasedMethod("dump_consensus_state"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "broadcastTxCommit", _this.createCallBasedMethod("broadcast_tx_commit"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "broadcastTxSync", _this.createCallBasedMethod("broadcast_tx_sync"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "broadcastTxAsync", _this.createCallBasedMethod("broadcast_tx_async"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "unconfirmedTxs", _this.createCallBasedMethod("unconfirmed_txs"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "numUnconfirmedTxs", _this.createCallBasedMethod("num_unconfirmed_txs"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "commit", _this.createCallBasedMethod("commit"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "tx", _this.createCallBasedMethod("tx"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "txSearch", _this.createCallBasedMethod("tx_search"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "abciQuery", _this.createCallBasedMethod("abci_query"));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "abciInfo", _this.createCallBasedMethod("abci_info"));

    var _url$parse = _url["default"].parse(uriString),
        protocol = _url$parse.protocol,
        hostname = _url$parse.hostname,
        port = _url$parse.port; // default to http


    if (!protocol || !allProtocols.includes(protocol)) {
      var uri = _url["default"].parse("http://".concat(uriString));

      protocol = uri.protocol;
      hostname = uri.hostname;
      port = uri.port;
    }

    _this.uri = !port ? "".concat(protocol, "//").concat(hostname, "/") : "".concat(protocol, "//").concat(hostname, ":").concat(port, "/");

    if (protocol && wsProtocols.includes(protocol)) {
      _this.uri = "".concat(_this.uri, "websocket");
      _this.call = _this.callWs;

      _this.connectWs();
    } else if (protocol && httpProtocols.includes(protocol)) {
      _this.call = _this.callHttp;
    }

    return _this;
  }

  (0, _createClass2["default"])(BaseRpc, [{
    key: "connectWs",
    value: function connectWs() {
      var _this2 = this;

      this.ws = new _pumpify["default"].obj(_ndjson["default"].stringify(), (0, _websocketStream["default"])(this.uri));
      this.ws.on("error", function (err) {
        return _this2.emit("error", err);
      });
      this.ws.on("close", function () {
        if (_this2.closed) return;

        _this2.emit("error", Error("websocket disconnected"));
      });
      this.ws.on("data", function (data) {
        data = JSON.parse(data);
        if (!data.id) return;

        _this2.emit(data.id, data.error, data.result);
      });
    }
  }, {
    key: "callHttp",
    value: function callHttp(method, args) {
      var url = this.uri + method;
      url = convertHttpArgs(url, args);
      return (0, _axios["default"])({
        url: url
      }).then(function (_ref) {
        var data = _ref.data;

        if (data.error) {
          var err = Error(data.error.message);
          Object.assign(err, data.error);
          throw err;
        }

        return data.result;
      }, function (err) {
        throw Error(err);
      });
    }
  }, {
    key: "callWs",
    value: function callWs(method, args, listener) {
      var _this3 = this;

      var self = this;
      return new Promise(function (resolve, reject) {
        var _this3$ws;

        var id = Math.random().toString(36);
        var params = convertWsArgs(args);

        if (method === "subscribe") {
          if (typeof listener !== "function") {
            throw Error("Must provide listener function");
          } // events get passed to listener


          _this3.on(id + "#event", function (err, res) {
            if (err) return self.emit("error", err);
            return listener(res.data.value);
          }); // promise resolves on successful subscription or error


          _this3.on(id, function (err) {
            if (err) return reject(err);
            resolve();
          });
        } else {
          // response goes to promise
          _this3.once(id, function (err, res) {
            if (err) return reject(err);
            resolve(res);
          });
        }

        (_this3$ws = _this3.ws) === null || _this3$ws === void 0 ? void 0 : _this3$ws.write({
          jsonrpc: "2.0",
          id: id,
          method: method,
          params: params
        });
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.closed = true;
      if (!this.ws) return;
      this.ws.destroy();
    }
  }]);
  return BaseRpc;
}(_events.EventEmitter);

exports["default"] = BaseRpc;