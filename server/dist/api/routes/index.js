"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collect_1 = __importDefault(require("./collect"));
const address_1 = __importDefault(require("./address"));
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, collect_1.default)(app);
    (0, address_1.default)(app);
    return app;
};
//# sourceMappingURL=index.js.map