"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("./express"));
const cron_1 = __importDefault(require("../jobs/cron"));
exports.default = async ({ app: expressApp }) => {
    await (0, express_1.default)({ app: expressApp });
    await (0, cron_1.default)();
};
//# sourceMappingURL=index.js.map