"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const collect_1 = __importDefault(require("../../services/collect"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/collect", route);
    route.get("/local", async (req, res) => {
        const { type = "" } = req.query;
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.local();
        return res.status(200).json({ message: "Success" });
    });
    route.get("/region", async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.region();
        return res.status(200).json({ message: "Success" });
    });
    route.get("/dong", async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.dong();
        return res.status(200).json({ message: "Success" });
    });
};
//# sourceMappingURL=collect.js.map