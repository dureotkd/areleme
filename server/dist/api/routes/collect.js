"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const collect_1 = __importDefault(require("../../services/collect/collect"));
const alarm_1 = __importDefault(require("../../services/core/alarm"));
const naver_1 = __importDefault(require("../../services/core/naver"));
const log_1 = __importDefault(require("../../services/core/log"));
const valid_1 = require("../../utils/valid");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/collect', route);
    // http://localhost:5000/api/collect/local
    route.get('/local', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverLocal();
        await collectService.saveDabangLocal();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:5000/api/collect/region
    route.get('/region', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverRegion();
        await collectService.saveDabangRegion();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:5000/api/collect/dong
    route.get('/dong', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverDong();
        await collectService.saveDabangDong();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:5000/api/collect/test
    route.get('/test', async (req, res) => {
        const AlarmService = typedi_1.default.get(alarm_1.default);
        const NaverService = typedi_1.default.get(naver_1.default);
        const LogService = typedi_1.default.get(log_1.default);
        const settings = await AlarmService.getSettings();
        const logRes = {
            ok: 1,
            msg: '',
            settingSeq: 0,
            alarmSeq: 0,
            complexNo: 0,
        };
        /**
         * 1. settings를 반복문 돌리면서 설정값을 확인한다.
         * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
         * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
         * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
         * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
         */
        const complexDetails = [];
        for await (const settingRow of settings) {
            const { seq, userSeq, params, sendTypes } = settingRow;
            logRes.settingSeq = seq;
            const paramArray = JSON.parse(params);
            const naverQs = NaverService.converyToQuery(paramArray);
            const complexes = await NaverService.fetchComplexes(naverQs);
            if ((0, valid_1.empty)(complexes)) {
                logRes.ok = 0;
                logRes.msg = 'complexes가 존재하지 않습니다';
                // await LogService.makeAlarmLog(logRes);
                break;
            }
            for await (const complexRow of complexes) {
                const { complexNo } = complexRow;
                logRes.complexNo = complexNo;
                // 최근게시글
                naverQs.order = 'dateDesc';
                const complexDetail = await NaverService.fetchComplexDetail(complexNo, naverQs);
                console.log(complexDetail);
                if ((0, valid_1.empty)(complexDetail)) {
                    logRes.ok = 0;
                    logRes.msg = 'complexDetail가 존재하지 않습니다';
                    // await LogService.makeAlarmLog(logRes);
                    continue;
                }
                break;
            }
        }
        return res.status(200).json({ message: 'Success' });
    });
    route.get('/dabang/test');
};
//# sourceMappingURL=collect.js.map