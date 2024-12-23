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
    app.use('/collect', route);
    // http://localhost:5000/api/collect/local
    route.get('/local', async (req, res) => {
        const { type = '' } = req.query;
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.naverLocal();
        await collectService.dabangLocal();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:5000/api/collect/region
    route.get('/region', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.naverRegion();
        await collectService.dabangRegion();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:5000/api/collect/dong
    route.get('/dong', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        // await collectService.naverDong();
        await collectService.dabangDong();
        return res.status(200).json({ message: 'Success' });
    });
};
//# sourceMappingURL=collect.js.map