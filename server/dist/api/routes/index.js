"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collect_1 = __importDefault(require("./collect"));
const address_1 = __importDefault(require("./address"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const alarm_1 = __importDefault(require("./alarm"));
const setting_1 = __importDefault(require("./setting"));
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, collect_1.default)(app);
    (0, address_1.default)(app);
    (0, auth_1.default)(app);
    (0, user_1.default)(app);
    (0, setting_1.default)(app);
    (0, alarm_1.default)(app);
    return app;
};
//# sourceMappingURL=index.js.map