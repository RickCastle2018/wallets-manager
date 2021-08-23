"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BindStatus = exports.RefundReason = exports.ClaimTypes = void 0;
var ClaimTypes;
exports.ClaimTypes = ClaimTypes;

(function (ClaimTypes) {
  ClaimTypes[ClaimTypes["ClaimTypeSkipSequence"] = 1] = "ClaimTypeSkipSequence";
  ClaimTypes[ClaimTypes["ClaimTypeUpdateBind"] = 2] = "ClaimTypeUpdateBind";
  ClaimTypes[ClaimTypes["ClaimTypeTransferOutRefund"] = 3] = "ClaimTypeTransferOutRefund";
  ClaimTypes[ClaimTypes["ClaimTypeTransferIn"] = 4] = "ClaimTypeTransferIn";
})(ClaimTypes || (exports.ClaimTypes = ClaimTypes = {}));

var RefundReason;
exports.RefundReason = RefundReason;

(function (RefundReason) {
  RefundReason[RefundReason["UnboundToken"] = 1] = "UnboundToken";
  RefundReason[RefundReason["Timeout"] = 2] = "Timeout";
  RefundReason[RefundReason["InsufficientBalance"] = 3] = "InsufficientBalance";
  RefundReason[RefundReason["Unkown"] = 4] = "Unkown";
})(RefundReason || (exports.RefundReason = RefundReason = {}));

var BindStatus;
exports.BindStatus = BindStatus;

(function (BindStatus) {
  BindStatus[BindStatus["BindStatusSuccess"] = 0] = "BindStatusSuccess";
  BindStatus[BindStatus["BindStatusRejected"] = 1] = "BindStatusRejected";
  BindStatus[BindStatus["BindStatusTimeout"] = 2] = "BindStatusTimeout";
  BindStatus[BindStatus["BindStatusInvalidParameter"] = 3] = "BindStatusInvalidParameter";
})(BindStatus || (exports.BindStatus = BindStatus = {}));