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
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const model_1 = __importDefault(require("./core/model"));
const time_1 = require("../utils/time");
const config_1 = __importDefault(require("../config"));
let NaverService = class NaverService {
    modelService;
    constructor(modelService) {
        this.modelService = modelService;
    }
    async local() {
        try {
            const data = await (0, request_promise_native_1.default)({
                uri: 'https://new.land.naver.com/api/regions/list?cortarNo=0000000000',
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                },
            }).then((res) => {
                const { regionList = [] } = JSON.parse(res);
                return regionList;
            });
            return data;
        }
        catch (error) { }
    }
    async region() {
        const localAll = await this.modelService.excute({
            sql: 'SELECT * FROM areleme.naver_local',
            type: 'all',
        });
        const regions = [];
        for await (const row of localAll) {
            await (0, request_promise_native_1.default)({
                uri: `https://new.land.naver.com/api/regions/list?cortarNo=${row.code}`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                },
            }).then((res) => {
                const { regionList = [] } = JSON.parse(res); // regionList
                regionList.forEach((item) => {
                    regions.push({
                        ...item,
                        localCode: row.code,
                    });
                });
            });
        }
        return regions;
    }
    async dong() {
        const regionAll = await this.modelService.excute({
            sql: 'SELECT * FROM areleme.naver_region',
            type: 'all',
        });
        const dongs = [];
        for await (const row of regionAll) {
            await (0, request_promise_native_1.default)({
                uri: `https://new.land.naver.com/api/regions/list?cortarNo=${row.code}`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                },
            }).then((res) => {
                const { regionList = [] } = JSON.parse(res); // regionList
                regionList.forEach((item) => {
                    dongs.push({
                        ...item,
                        localCode: row.localCode,
                        regionCode: row.code,
                    });
                });
            });
            await (0, time_1.wait)(1500);
        }
        return dongs;
    }
    /**
     * https://api.ncloud-docs.com/docs/ai-naver-mapsreversegeocoding-gc
     */
    async searchLocation() {
        await (0, request_promise_native_1.default)('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=127.585%2C34.9765&output=json&orders=legalcode%2Cadmcode%2Caddr%2Croadaddr', {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': config_1.default.naver.access_key, // Naver API Key ID
                'X-NCP-APIGW-API-KEY': config_1.default.naver.secret_key, // Naver API Key
            },
        }).then((res) => {
            console.log(res);
        });
    }
};
NaverService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [model_1.default])
], NaverService);
exports.default = NaverService;
//# sourceMappingURL=naver.js.map