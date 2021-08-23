"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  encodeNumber: true,
  encodeBool: true,
  encodeString: true,
  encodeTime: true,
  convertObjectToSignBytes: true,
  marshalBinary: true,
  marshalBinaryBare: true,
  encodeBinary: true,
  encodeBinaryByteArray: true,
  encodeObjectBinary: true,
  encodeArrayBinary: true
};
exports.encodeArrayBinary = exports.encodeObjectBinary = exports.encodeBinaryByteArray = exports.encodeBinary = exports.marshalBinaryBare = exports.marshalBinary = exports.convertObjectToSignBytes = exports.encodeTime = exports.encodeString = exports.encodeBool = exports.encodeNumber = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _is_js = _interopRequireDefault(require("is_js"));

var _protocolBuffersEncodings = require("protocol-buffers-encodings");

var _encoderHelper = _interopRequireDefault(require("../../utils/encoderHelper"));

var _varint = require("./varint");

Object.keys(_varint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _varint[key];
    }
  });
});

var sortObject = function sortObject(obj) {
  if (obj === null) return null;
  if ((0, _typeof2["default"])(obj) !== "object") return obj; // arrays have typeof "object" in js!

  if (Array.isArray(obj)) return obj.map(sortObject);
  var sortedKeys = Object.keys(obj).sort();
  var result = {};
  sortedKeys.forEach(function (key) {
    result[key] = sortObject(obj[key]);
  });
  return result;
};
/**
 * encode number
 * @category amino
 * @param num
 */


var encodeNumber = function encodeNumber(num) {
  return _varint.UVarInt.encode(num);
};
/**
 * encode bool
 * @category amino
 * @param b
 */


exports.encodeNumber = encodeNumber;

var encodeBool = function encodeBool(b) {
  return b ? _varint.UVarInt.encode(1) : _varint.UVarInt.encode(0);
};
/**
 * encode string
 * @category amino
 * @param str
 */


exports.encodeBool = encodeBool;

var encodeString = function encodeString(str) {
  var buf = Buffer.alloc(_protocolBuffersEncodings.string.encodingLength(str));
  return _protocolBuffersEncodings.string.encode(str, buf, 0);
};
/**
 * encode time
 * @category amino
 * @param value
 */


exports.encodeString = encodeString;

var encodeTime = function encodeTime(value) {
  var millis = new Date(value).getTime();
  var seconds = Math.floor(millis / 1000);
  var nanos = Number(seconds.toString().padEnd(9, "0"));
  var buffer = Buffer.alloc(14); // buffer[0] = (1 << 3) | 1 // field 1, typ3 1

  buffer.writeInt32LE(1 << 3 | 1, 0);
  buffer.writeUInt32LE(seconds, 1); // buffer[9] = (2 << 3) | 5 // field 2, typ3 5

  buffer.writeInt32LE(2 << 3 | 5, 9);
  buffer.writeUInt32LE(nanos, 10);
  return buffer;
};
/**
 * @category amino
 * @param obj -- {object}
 * @return bytes {Buffer}
 */


exports.encodeTime = encodeTime;

var convertObjectToSignBytes = function convertObjectToSignBytes(obj) {
  return Buffer.from(JSON.stringify(sortObject(obj)));
};
/**
 * js amino MarshalBinary
 * @category amino
 * @param {Object} obj
 *  */


exports.convertObjectToSignBytes = convertObjectToSignBytes;

var marshalBinary = function marshalBinary(obj) {
  if (!_is_js["default"].object(obj)) throw new TypeError("data must be an object");
  return encodeBinary(obj, -1, true).toString("hex");
};
/**
 * js amino MarshalBinaryBare
 * @category amino
 * @param {Object} obj
 *  */


exports.marshalBinary = marshalBinary;

var marshalBinaryBare = function marshalBinaryBare(obj) {
  if (!_is_js["default"].object(obj)) throw new TypeError("data must be an object");
  return encodeBinary(obj).toString("hex");
};
/**
 * This is the main entrypoint for encoding all types in binary form.
 * @category amino
 * @param {*} js data type (not null, not undefined)
 * @param {Number} field index of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */


exports.marshalBinaryBare = marshalBinaryBare;

var encodeBinary = function encodeBinary(val, fieldNum, isByteLenPrefix) {
  if (val === null || val === undefined) throw new TypeError("unsupported type");

  if (Buffer.isBuffer(val)) {
    if (isByteLenPrefix) {
      return Buffer.concat([_varint.UVarInt.encode(val.length), val]);
    }

    return val;
  }

  if (_is_js["default"].array(val)) {
    return encodeArrayBinary(fieldNum, val, isByteLenPrefix);
  }

  if (_is_js["default"].number(val)) {
    return encodeNumber(val);
  }

  if (_is_js["default"]["boolean"](val)) {
    return encodeBool(val);
  }

  if (_is_js["default"].string(val)) {
    return encodeString(val);
  }

  if (_is_js["default"].object(val)) {
    return encodeObjectBinary(val, isByteLenPrefix);
  }

  return;
};
/**
 * prefixed with bytes length
 * @category amino
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */


exports.encodeBinary = encodeBinary;

var encodeBinaryByteArray = function encodeBinaryByteArray(bytes) {
  var lenPrefix = bytes.length;
  return Buffer.concat([_varint.UVarInt.encode(lenPrefix), bytes]);
};
/**
 * @category amino
 * @param {Object} obj
 * @return {Buffer} with bytes length prefixed
 */


exports.encodeBinaryByteArray = encodeBinaryByteArray;

var encodeObjectBinary = function encodeObjectBinary(obj, isByteLenPrefix) {
  var bufferArr = [];
  Object.keys(obj).forEach(function (key, index) {
    if (key === "aminoPrefix" || key === "version") return;
    if (isDefaultValue(obj[key])) return;

    if (_is_js["default"].array(obj[key]) && obj[key].length > 0) {
      bufferArr.push(encodeArrayBinary(index, obj[key]));
    } else {
      bufferArr.push(encodeTypeAndField(index, obj[key]));
      bufferArr.push(encodeBinary(obj[key], index, true));
    }
  });
  var bytes = Buffer.concat(bufferArr); // add prefix

  if (obj.aminoPrefix) {
    var prefix = Buffer.from(obj.aminoPrefix, "hex");
    bytes = Buffer.concat([prefix, bytes]);
  } // Write byte-length prefixed.


  if (isByteLenPrefix) {
    var lenBytes = _varint.UVarInt.encode(bytes.length);

    bytes = Buffer.concat([lenBytes, bytes]);
  }

  return bytes;
};
/**
 * @category amino
 * @param {Number} fieldNum object field index
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */


exports.encodeObjectBinary = encodeObjectBinary;

var encodeArrayBinary = function encodeArrayBinary(fieldNum, arr, isByteLenPrefix) {
  var result = [];
  arr.forEach(function (item) {
    result.push(encodeTypeAndField(fieldNum, item));

    if (isDefaultValue(item)) {
      result.push(Buffer.from("00", "hex"));
      return;
    }

    result.push(encodeBinary(item, fieldNum, true));
  }); //encode length

  if (isByteLenPrefix) {
    var length = result.reduce(function (prev, item) {
      return prev + item.length;
    }, 0);
    result.unshift(_varint.UVarInt.encode(length));
  }

  return Buffer.concat(result);
}; // Write field key.


exports.encodeArrayBinary = encodeArrayBinary;

var encodeTypeAndField = function encodeTypeAndField(index, field) {
  index = Number(index);
  var value = index + 1 << 3 | (0, _encoderHelper["default"])(field);
  return _varint.UVarInt.encode(value);
};

var isDefaultValue = function isDefaultValue(obj) {
  if (obj === null) return false;
  return _is_js["default"].number(obj) && obj === 0 || _is_js["default"].string(obj) && obj === "" || _is_js["default"].array(obj) && obj.length === 0 || _is_js["default"]["boolean"](obj) && !obj;
};