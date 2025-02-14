"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const collect_1 = __importDefault(require("../../services/collect/collect"));
const naver_1 = __importDefault(require("../../services/platform/naver"));
const requestManager_1 = __importDefault(require("../../services/utils/requestManager"));
const dabang_1 = __importDefault(require("../../services/platform/dabang"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/collect', route);
    // collect/local
    route.get('/local', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverLocal();
        await collectService.saveDabangLocal();
        return res.status(200).json({ message: 'Success' });
    });
    // collect/region
    route.get('/region', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverRegion();
        await collectService.saveDabangRegion();
        return res.status(200).json({ message: 'Success' });
    });
    // collect/dong
    route.get('/dong', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverDong();
        await collectService.saveDabangDong();
        return res.status(200).json({ message: 'Success' });
    });
    // collect/proxy
    route.get('/proxy', async (req, res) => {
        const RequestManagerService = typedi_1.default.get(requestManager_1.default);
        await RequestManagerService.makeProxy();
        return res.status(200).json({ message: 'Success' });
    });
    // collect/alarm
    route.get('/alarm', async (req, res) => {
        const NaverService = typedi_1.default.get(naver_1.default);
        const DabangService = typedi_1.default.get(dabang_1.default);
        /**
         * 1. settings를 반복문 돌리면서 설정값을 확인한다.
         * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
         * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
         * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
         * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
         */
        await NaverService.runNewEstate();
        await DabangService.runNewEstate();
        return res.status(200).json({ message: 'Success' });
    });
};
//# sourceMappingURL=collect.js.map