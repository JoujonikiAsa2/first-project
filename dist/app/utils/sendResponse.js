"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, response) => {
    const { statusCode, success, message, meta, data } = response;
    res.status(statusCode).json({
        success,
        message,
        meta,
        data,
    });
};
exports.sendResponse = sendResponse;
