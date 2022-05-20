"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res) => {
    res.status(500);
    return res.render('error', { error: err });
};
exports.default = errorHandler;
