"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _amino = require("../amino");

var crypto = _interopRequireWildcard(require("../crypto"));

var _types = require("../types");

/**
 * Creates a new transaction object.
 * @example
 * var rawTx = {
 *   accountNumber: 1,
 *   chainId: 'bnbchain-1000',
 *   memo: '',
 *   msg: {},
 *   type: 'NewOrderMsg',
 *   sequence: 29,
 *   source: 0
 * };
 * var tx = new Transaction(rawTx);
 * @property {Buffer} raw The raw vstruct encoded transaction
 * @param {Number} data.account_number account number
 * @param {String} data.chain_id bnbChain Id
 * @param {String} data.memo transaction memo
 * @param {String} type transaction type
 * @param {Msg} data.msg object data of tx type
 * @param {Number} data.sequence transaction counts
 * @param {Number} data.source where does this transaction come from
 */
var Transaction = /*#__PURE__*/function () {
  // DEPRECATED: Retained for backward compatibility,
  function Transaction(data) {
    (0, _classCallCheck2["default"])(this, Transaction);
    (0, _defineProperty2["default"])(this, "sequence", void 0);
    (0, _defineProperty2["default"])(this, "accountNumber", void 0);
    (0, _defineProperty2["default"])(this, "chainId", void 0);
    (0, _defineProperty2["default"])(this, "msg", void 0);
    (0, _defineProperty2["default"])(this, "baseMsg", void 0);
    (0, _defineProperty2["default"])(this, "memo", void 0);
    (0, _defineProperty2["default"])(this, "source", void 0);
    (0, _defineProperty2["default"])(this, "signatures", void 0);
    data = data || {};

    if (!data.chainId) {
      throw new Error("chain id should not be null");
    }

    this.sequence = data.sequence || 0;
    this.accountNumber = data.accountNumber || 0;
    this.chainId = data.chainId;
    this.msg = data.msg;
    this.baseMsg = data.baseMsg;
    this.memo = data.memo;
    this.source = data.source || 0; // default value is 0

    this.signatures = [];
  }
  /**
   * generate the sign bytes for a transaction, given a msg
   * @param {SignMsg} concrete msg object
   * @return {Buffer}
   **/


  (0, _createClass2["default"])(Transaction, [{
    key: "getSignBytes",
    value: function getSignBytes(msg) {
      msg = msg || this.baseMsg && this.baseMsg.getSignMsg();
      var signMsg = {
        account_number: this.accountNumber.toString(),
        chain_id: this.chainId,
        data: null,
        memo: this.memo,
        msgs: [msg],
        sequence: this.sequence.toString(),
        source: this.source.toString()
      };
      return (0, _amino.convertObjectToSignBytes)(signMsg);
    }
    /**
     * attaches a signature to the transaction
     * @param {Elliptic.PublicKey} pubKey
     * @param {Buffer} signature
     * @return {Transaction}
     **/

  }, {
    key: "addSignature",
    value: function addSignature(pubKey, signature) {
      var pubKeyBuf = this._serializePubKey(pubKey); // => Buffer


      this.signatures = [{
        pub_key: pubKeyBuf,
        signature: signature,
        account_number: this.accountNumber,
        sequence: this.sequence
      }];
      return this;
    }
    /**
     * sign transaction with a given private key and msg
     * @param {string} privateKey private key hex string
     * @param {SignMsg} concrete msg object
     * @return {Transaction}
     **/

  }, {
    key: "sign",
    value: function sign(privateKey, msg) {
      if (!privateKey) {
        throw new Error("private key should not be null");
      }

      var signBytes = this.getSignBytes(msg);
      var privKeyBuf = Buffer.from(privateKey, "hex");
      var signature = crypto.generateSignature(signBytes.toString("hex"), privKeyBuf);
      this.addSignature(crypto.generatePubKey(privKeyBuf), signature);
      return this;
    }
    /**
     * encode signed transaction to hex which is compatible with amino
     */

  }, {
    key: "serialize",
    value: function serialize() {
      if (!this.signatures) {
        throw new Error("need signature");
      }

      var msg = this.msg || this.baseMsg && this.baseMsg.getMsg();
      var stdTx = {
        msg: [msg],
        signatures: this.signatures,
        memo: this.memo,
        source: this.source,
        // sdk value is 0, web wallet value is 1
        data: "",
        aminoPrefix: _types.AminoPrefix.StdTx
      };
      var bytes = (0, _amino.marshalBinary)(stdTx);
      return bytes.toString("hex");
    }
    /**
     * serializes a public key in a 33-byte compressed format.
     * @param {Elliptic.PublicKey} unencodedPubKey
     * @return {Buffer}
     */

  }, {
    key: "_serializePubKey",
    value: function _serializePubKey(unencodedPubKey) {
      var format = 0x2;
      var y = unencodedPubKey.getY();
      var x = unencodedPubKey.getX();

      if (y && y.isOdd()) {
        format |= 0x1;
      }

      var pubBz = Buffer.concat([_amino.UVarInt.encode(format), x.toArrayLike(Buffer, "be", 32)]); // prefixed with length

      pubBz = (0, _amino.encodeBinaryByteArray)(pubBz); // add the amino prefix

      pubBz = Buffer.concat([Buffer.from("EB5AE987", "hex"), pubBz]);
      return pubBz;
    }
  }]);
  return Transaction;
}();

exports["default"] = Transaction;