"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const config_1 = __importDefault(require("../config"));
const database = mysql2_1.default.createPoolCluster();
database.add("areleme", {
    host: config_1.default.db.host,
    user: config_1.default.db.id,
    password: config_1.default.db.pw,
    database: config_1.default.db.name,
    port: 3306,
});
exports.default = database;
//# sourceMappingURL=database.js.map