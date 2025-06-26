"use strict";
exports.__esModule = true;
exports.contextDataDigitalAddressMiddleware = void 0;
var pdnd_common_1 = require("pdnd-common");
var headers_js_1 = require("./headers.js");
var contextDataDigitalAddressMiddleware = function (req, _res, next) {
    var _a;
    var headers = headers_js_1.readHeadersDigitalAddress(req);
    if (headers) {
        var context = pdnd_common_1.getContext();
        context.authData = {
            purposeId: headers.purposeId,
            clientId: headers.clientId
        };
        context.correlationId = headers === null || headers === void 0 ? void 0 : headers.correlationId;
    }
    else {
        var context = pdnd_common_1.getContext();
        context.correlationId = Array.isArray(req.headers["x-correlation-id"])
            ? req.headers["x-correlation-id"][0]
            : (_a = req.headers["x-correlation-id"]) !== null && _a !== void 0 ? _a : "";
    }
    next();
};
exports.contextDataDigitalAddressMiddleware = contextDataDigitalAddressMiddleware;
