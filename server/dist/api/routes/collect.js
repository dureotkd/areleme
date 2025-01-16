"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const collect_1 = __importDefault(require("../../services/collect/collect"));
const alarm_1 = __importDefault(require("../../services/core/alarm"));
const naver_1 = __importDefault(require("../../services/platform/naver"));
const estate_1 = __importDefault(require("../../services/core/estate"));
const requestManager_1 = __importDefault(require("../../services/utils/requestManager"));
const valid_1 = require("../../utils/valid");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/collect', route);
    // http://localhost:4000/api/collect/local
    route.get('/local', async (req, res) => {
        const collectService = typedi_1.default.get(collect_1.default);
        await collectService.saveNaverLocal();
        // await collectService.saveDabangLocal();
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
    // http://localhost:4000/api/collect/alarm
    route.get('/alarm', async (req, res) => {
        const AlarmService = typedi_1.default.get(alarm_1.default);
        const NaverService = typedi_1.default.get(naver_1.default);
        const EstateService = typedi_1.default.get(estate_1.default);
        const settings = await AlarmService.getSettings();
        console.log(`======= 알림 START 총 : ${settings.length} =======\n`);
        /**
         * 1. settings를 반복문 돌리면서 설정값을 확인한다.
         * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
         * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
         * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
         * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
         */
        for await (const setting of settings) {
            const paramJson = JSON.parse(setting.params);
            const naverQs = NaverService.convertToQuery(paramJson);
            console.log(`setting : ${setting.seq} START \n`, naverQs);
            switch (paramJson.estateType) {
                case 'apt':
                case 'op':
                    const complexes = await NaverService.getComplexCustomQuery({
                        where: [`settingSeq = '${setting.seq}'`],
                        type: 'all',
                    });
                    if (!(0, valid_1.empty)(complexes)) {
                        for await (const complex of complexes) {
                            const lastEstate = await NaverService.getLastEstateQuery({
                                where: [`settingSeq = '${setting.seq}'`, `complexNo = '${complex.no}'`],
                                type: 'row',
                            });
                            const complexDetails = await NaverService.fetchComplexDetails(complex.no, naverQs);
                            console.log(`complexName:${complex.name} :: ${complexDetails.length} \n`);
                            const findNewEstates = await EstateService.findNewEstates(complexDetails, lastEstate);
                            if ((0, valid_1.empty)(findNewEstates)) {
                                console.log(`매물이 존재하지 않습니다 :: ${complex.name} (${complex.no}) \n`);
                                continue;
                            }
                            for await (const newEstate of findNewEstates) {
                                newEstate.type = 'naver';
                                newEstate.settingSeq = setting.seq;
                                const myEstateEntitiy = await NaverService.convertToEstate(newEstate);
                                const estateSeq = await EstateService.makeEstate(myEstateEntitiy);
                                if ((0, valid_1.empty)(estateSeq)) {
                                    // ! DB ERROR
                                    console.log(`매물 등록시 에러가 발생하였습니다`);
                                    continue;
                                }
                                // * 알림 보내고
                                const alarmRes = await AlarmService.sendAlarm(estateSeq);
                                if ((0, valid_1.empty)(alarmRes)) {
                                    // ! Alarm API ERROR
                                    console.log(`알림 전송시 에러가 발생하였습니다`);
                                    continue;
                                }
                            }
                            const findLastEstate = findNewEstates[findNewEstates.length - 1];
                            /**
                             * ? 테스트를 어떻게 할것인가..
                             *
                             * * 처음 Setting후 LastEstate가 Insert안됐지만
                             * * 알림 전송 과정에서 발견하였을 경우!
                             */
                            if (!(0, valid_1.empty)(lastEstate)) {
                                // * UPDATE ...
                                await EstateService.updateLastEstate({
                                    settingSeq: setting.seq,
                                    articleNo: findLastEstate.articleNo,
                                    complexNo: findLastEstate.complexNo,
                                    type: 'naver',
                                });
                            }
                            else {
                                // & INSERT ...
                                await EstateService.makeInitLastEstateNaver(setting.seq, naverQs);
                            }
                        }
                    }
                    break;
                case 'one':
                case 'villa':
                    const estates = paramJson.estateType === 'one'
                        ? await NaverService.fetchOneTowRooms(naverQs)
                        : await NaverService.fetchVillaJutaeks(naverQs);
                    const lastEstate = await NaverService.getLastEstateQuery({
                        where: [`settingSeq = '${setting.seq}'`],
                        type: 'row',
                    });
                    const findNewEstates = await EstateService.findNewEstates(estates, lastEstate);
                    if ((0, valid_1.empty)(findNewEstates)) {
                        console.log(`매물이 존재하지 않습니다 :: 원/투룸 \n`);
                        continue;
                    }
                    for await (const newEstate of findNewEstates) {
                        newEstate.type = 'naver';
                        newEstate.settingSeq = setting.seq;
                        const myEstateEntitiy = await NaverService.convertToEstate(newEstate);
                        const estateSeq = await EstateService.makeEstate(myEstateEntitiy);
                        if ((0, valid_1.empty)(estateSeq)) {
                            // ! DB ERROR
                            console.log(`매물 등록시 에러가 발생하였습니다`);
                            continue;
                        }
                        // * 알림 보내고
                        const alarmRes = await AlarmService.sendAlarm(estateSeq);
                        if ((0, valid_1.empty)(alarmRes)) {
                            // ! Alarm API ERROR
                            console.log(`알림 전송시 에러가 발생하였습니다`);
                            continue;
                        }
                    }
                    const findLastEstate = findNewEstates[findNewEstates.length - 1];
                    // * UPDATE ...
                    await EstateService.updateLastEstate({
                        settingSeq: setting.seq,
                        articleNo: findLastEstate.articleNo,
                        complexNo: findLastEstate.complexNo,
                        type: 'naver',
                    });
                    break;
            }
        }
        console.log(`======= 알림 END 총 : ${settings.length} =======`);
        return res.status(200).json({ message: 'Success' });
    });
};
//# sourceMappingURL=collect.js.map