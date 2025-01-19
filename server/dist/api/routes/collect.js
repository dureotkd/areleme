"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const collect_1 = __importDefault(require("../../services/collect/collect"));
const naver_1 = __importDefault(require("../../services/platform/naver"));
const complex_1 = __importDefault(require("../../services/core/complex"));
const requestManager_1 = __importDefault(require("../../services/utils/requestManager"));
const dabang_1 = __importDefault(require("../../services/platform/dabang"));
const valid_1 = require("../../utils/valid");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/collect', route);
    // http://localhost:4000/api/collect/local
    route.get('/local', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverLocal();
        await collectService.saveDabangLocal();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:4000/api/collect/region
    route.get('/region', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverRegion();
        await collectService.saveDabangRegion();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:4000/api/collect/dong
    route.get('/dong', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverDong();
        await collectService.saveDabangDong();
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:4000/api/collect/proxy
    route.get('/proxy', async (req, res) => {
        const RequestManagerService = typedi_1.default.get(requestManager_1.default);
        await RequestManagerService.makeProxy();
        return res.status(200).json({ message: 'Success' });
    });
    route.get('/dabang-one', async (req, res) => {
        const RequestManagerService = typedi_1.default.get(requestManager_1.default);
        const a = await (0, request_promise_native_1.default)({
            uri: 'https://www.dabangapp.com/api/v5/room-list/category/one-two/region',
            method: 'GET',
            qs: {
                code: '30170112',
                page: 1,
                useMap: 'naver',
                zoom: 14,
                filters: '{"sellingTypeList":["MONTHLY_RENT"],"depositRange":{"min":0,"max":999999},"priceRange":{"min":0,"max":999999},"isIncludeMaintenance":false,"pyeongRange":{"min":0,"max":999999},"useApprovalDateRange":{"min":0,"max":999999},"roomFloorList":["GROUND_FIRST","GROUND_SECOND_OVER","SEMI_BASEMENT","ROOFTOP"],"roomTypeList":["ONE_ROOM","TWO_ROOM"],"dealTypeList":["AGENT","DIRECT"],"canParking":false,"isShortLease":false,"hasElevator":false,"hasPano":false,"isDivision":false,"isDuplex":false}',
            },
            proxy: await RequestManagerService.getRandomProxy(),
            headers: RequestManagerService.getHeadersDabang(),
        }).then((res) => {
            return JSON.parse(res);
        });
        console.log(a.result);
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:4000/api/collect/dabang
    route.get('/dabang', async (req, res) => {
        const dabangService = typedi_1.default.get(dabang_1.default);
        const naverService = typedi_1.default.get(naver_1.default);
        const complexService = typedi_1.default.get(complex_1.default);
        const complexes = (await dabangService.fetchComplexes('대전시 서구 둔산동'));
        const a = '{"estateType":"apt","tradeType":"sell","local":"3000000000","region":"3017000000","dong":"3017011200","details":{"cost":[450000000,1000000001],"rentCost":[100000,2000000],"pyeong":[10,30]},"selectCodes":["email"]}';
        for await (const { name, location: [lng, lat], complex_id, } of complexes) {
            const naverComplex = await complexService.getComplexCustomQuery({
                where: [`\`name\` = '${name}'`, `settingSeq = 1`],
                type: 'row',
            });
            if ((0, valid_1.empty)(naverComplex)) {
                console.log(`Hello.. Naver complex empty : ${name}`);
                continue;
            }
            await complexService.updateComplex({
                dno: complex_id,
                lat: lat,
                lng: lng,
            }, [`seq = '${naverComplex.seq}'`]);
        }
        return res.status(200).json({ message: 'Success' });
    });
    // http://localhost:4000/api/collect/alarm
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