"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const dabang_1 = __importDefault(require("./dabang"));
const naver_1 = __importDefault(require("./naver"));
const zigbang_1 = __importDefault(require("./zigbang"));
const model_1 = __importDefault(require("./core/model"));
const valid_1 = require("../utils/valid");
let CollectService = class CollectService {
    naverService;
    dabangService;
    zigbangService;
    modelService;
    constructor(naverService, dabangService, zigbangService, modelService) {
        this.naverService = naverService;
        this.dabangService = dabangService;
        this.zigbangService = zigbangService;
        this.modelService = modelService;
    }
    async naverLocal() {
        const data = await this.naverService.local();
        const list = data.map((item) => ({
            code: item.cortarNo,
            lat: item.centerLat,
            lng: item.centerLon,
            name: item.cortarName,
        }));
        for await (const row of list) {
            const localRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.naver_local WHERE code = '${row.code}'`,
                type: 'row',
            });
            if ((0, valid_1.empty)(localRow)) {
                const insertQuery = this.modelService.getInsertQuery({
                    table: 'areleme.naver_local',
                    data: row,
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: 'exec',
                    debug: false,
                });
            }
            else {
                console.log(`이미 존재하는 Local입니다. (네이버) ❗`, row);
            }
        }
    }
    async naverRegion() {
        const data = await this.naverService.region();
        const list = data.map((item) => {
            return {
                code: item.cortarNo,
                lat: item.centerLat,
                lng: item.centerLon,
                name: item.cortarName,
                localCode: item.localCode,
            };
        });
        for await (const row of list) {
            const regionRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.naver_region WHERE code = '${row.code}' AND localCode = '${row.localCode}'`,
                type: 'row',
            });
            if ((0, valid_1.empty)(regionRow)) {
                const insertQuery = this.modelService.getInsertQuery({
                    table: 'areleme.naver_region',
                    data: {
                        ...row,
                    },
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: 'exec',
                    debug: false,
                });
            }
            else {
                console.log(`이미 존재하는 Region입니다. (네이버) ❗`, row);
            }
        }
    }
    async naverDong() {
        const data = await this.naverService.dong();
        const list = data.map((item) => {
            return {
                code: item.cortarNo,
                lat: item.centerLat,
                lng: item.centerLon,
                name: item.cortarName,
                localCode: item.localCode,
                regionCode: item.regionCode,
            };
        });
        for await (const row of list) {
            const regionRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.naver_dong WHERE code = '${row.code}' AND localCode = '${row.localCode}' AND regionCode = '${row.regionCode}'`,
                type: 'row',
            });
            if ((0, valid_1.empty)(regionRow)) {
                const insertQuery = this.modelService.getInsertQuery({
                    table: 'areleme.naver_dong',
                    data: {
                        ...row,
                        localCode: row.localCode,
                        regionCode: row.regionCode,
                    },
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: 'exec',
                    debug: false,
                });
            }
            else {
                console.log(`이미 존재하는 Dong입니다. (네이버)❗`, row);
            }
        }
    }
    async dabangLocal() {
        const data = await this.dabangService.local();
        const list = data.map((item) => ({
            code: item.code,
            lat: item.location.lat,
            lng: item.location.lng,
            nLat: item.nextCenter.lat,
            nLng: item.nextCenter.lng,
            name: item.name,
        }));
        for await (const row of list) {
            const localRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.dabang_local WHERE code = '${row.code}'`,
                type: 'row',
            });
            if ((0, valid_1.empty)(localRow)) {
                const insertQuery = this.modelService.getInsertQuery({
                    table: 'areleme.dabang_local',
                    data: {
                        ...row,
                    },
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: 'exec',
                    debug: false,
                });
            }
            else {
                console.log(`이미 존재하는 Local입니다. (다방)❗`, row);
            }
        }
    }
    /**
     * {
  [1]     code: '47190',
  [1]     name: '구미시',
  [1]     location: { lat: 36.21153399457331, lng: 128.34841807148308 },
  [1]     nextCenter: { lat: 36.21153399457331, lng: 128.34841807148308 },
  [1]     nextZoom: 13,
  [1]     formatSellingType: '매',
  [1]     formatAveragePrice: '1.3억',
  [1]     isPopular: true,
  [1]     realTimeWatchCount: 0,
  [1]     contents: {
  [1]       pyeongPrice: 438,
  [1]       gapPrice: 3547,
  [1]       leasePriceRate: null,
  [1]       floorAreaRatio: 41,
  [1]       buildingCoverageRatio: 240,
  [1]       useApprovalYear: null,
  [1]       hou
     */
    async dabangRegion() {
        const regions = await this.dabangService.region();
        const list = [];
        /**
         * !문제점
         * * row.name : 서구,중구,동구
         * * 부산광역시 동구, 대전광역시 동구 등등등.. 중복되는 Local이 존재한다
         * * 이게 어떤 Local의 영속되어있는 Region인지 판단 불가
         */
        for await (const row of regions) {
            const naverRegion = await this.modelService.excute({
                sql: `SELECT * FROM areleme.naver_region a WHERE a.name='${row.name}'`,
                type: 'row',
            });
            // * 무조건 네이버부동산 기준으로
            if ((0, valid_1.empty)(naverRegion)) {
                console.log(`name : ${row.name}❌`);
                continue;
            }
            const addressInfos = await this.naverService.searchLocation(row.location.lat, row.location.lng);
            const address = addressInfos[0]?.region?.area1 || {};
            const dabangLocal = await this.modelService.excute({
                sql: `SELECT * FROM areleme.dabang_local WHERE name = '${address.name}'`,
                type: 'row',
            });
            if ((0, valid_1.empty)(dabangLocal)) {
                console.log(`존재하지 않는 지역구입니다 EX) 서구,중구,동구 등`, row);
                continue;
            }
            list.push({
                code: row.code,
                localCode: dabangLocal.code,
                lat: row.location.lat,
                lng: row.location.lng,
                nLat: row.nextCenter.lat,
                nLng: row.nextCenter.lng,
                name: row.name,
            });
        }
        for await (const row of list) {
            const regionRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.dabang_region WHERE code = '${row.code}' AND localCode='${row.localCode}'`,
                type: 'row',
            });
            if (!(0, valid_1.empty)(regionRow)) {
                console.log(`이미 존재하는 Region입니다. (다방)❗`, row.name);
            }
            else {
                const insertQuery = this.modelService.getInsertQuery({
                    table: 'areleme.dabang_region',
                    data: {
                        ...row,
                    },
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: 'exec',
                    debug: false,
                });
            }
        }
    }
    /**
     * 현재 매물이 없는 동일 경우
     * 위치를 제공 하지 않음..
     *
     */
    async dabangDong() {
        const dongs = await this.dabangService.dong();
        for await (const row of dongs) {
            const naverDong = await this.modelService.excute({
                sql: `SELECT * FROM areleme.naver_dong a WHERE a.name='${row.name}'`,
                type: 'row',
            });
            // * 무조건 네이버부동산 기준으로
            if ((0, valid_1.empty)(naverDong)) {
                console.log(`name : ${row.name}❌`);
                continue;
            }
            const addressInfos = await this.naverService.searchLocation(row.location.lat, row.location.lng);
            const localName = addressInfos[0]?.region?.area1?.name || '';
            const regionName = addressInfos[0]?.region?.area2?.name || '';
            const dongName = addressInfos[0]?.region?.area3?.name || '';
            const localRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.dabang_local WHERE name = '${localName}'`,
                type: 'row',
            });
            if ((0, valid_1.empty)(localRow)) {
                console.log(`존재하지 않는 시입니다 EX) 대전광역시,서울특별시 등`, row.name, row.location);
                continue;
            }
            const regionRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.dabang_region WHERE name = '${regionName}'`,
                type: 'row',
            });
            if ((0, valid_1.empty)(regionRow)) {
                console.log(`존재하지 않는 지역구입니다 EX) 서구,중구,동구 `, regionName, row.name, row.location);
                continue;
            }
            const dabangDong = await this.modelService.excute({
                sql: `SELECT * FROM areleme.dabang_dong WHERE code = '${row.code}' AND localCode = '${localRow.code}' AND regionCode = '${regionRow.code}'`,
                type: 'row',
            });
            if (!(0, valid_1.empty)(dabangDong)) {
                console.log(`이미 존재하는 Dong입니다. (다방)❗`, row.name);
            }
            else {
                const insertQuery = this.modelService.getInsertQuery({
                    table: 'areleme.dabang_dong',
                    data: {
                        localCode: localRow.code,
                        regionCode: regionRow.code,
                        code: row.code,
                        lat: row.location.lat,
                        lng: row.location.lng,
                        name: row.name,
                    },
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: 'exec',
                    debug: false,
                });
            }
        }
    }
};
CollectService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [naver_1.default,
        dabang_1.default,
        zigbang_1.default,
        model_1.default])
], CollectService);
exports.default = CollectService;
//# sourceMappingURL=collect.js.map