"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const database = mysql2_1.default.createPoolCluster();
database.add("areleme", {
    host: "211.238.133.10",
    user: "root",
    password: "@slsksh33@",
    database: "areleme",
    port: 3306,
});
exports.default = database;
//# sourceMappingURL=database.js.map