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
const puppeteer_1 = __importDefault(require("puppeteer"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const model_1 = __importDefault(require("./core/model"));
let DabangService = class DabangService {
    modelService;
    constructor(modelService) {
        this.modelService = modelService;
    }
    async local() {
        const { result: { stateList }, } = await (0, request_promise_native_1.default)({
            uri: 'https://www.dabangapp.com/api/v5/markers/category/one-two?bbox=%7B%22sw%22%3A%7B%22lat%22%3A33.1460636%2C%22lng%22%3A121.5391567%7D%2C%22ne%22%3A%7B%22lat%22%3A38.9502276%2C%22lng%22%3A136.0356167%7D%7D&filters=%7B%22sellingTypeList%22%3A%5B%22MONTHLY_RENT%22%2C%22LEASE%22%5D%2C%22depositRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22priceRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22isIncludeMaintenance%22%3Afalse%2C%22pyeongRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22useApprovalDateRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22roomFloorList%22%3A%5B%22GROUND_FIRST%22%2C%22GROUND_SECOND_OVER%22%2C%22SEMI_BASEMENT%22%2C%22ROOFTOP%22%5D%2C%22roomTypeList%22%3A%5B%22ONE_ROOM%22%2C%22TWO_ROOM%22%5D%2C%22dealTypeList%22%3A%5B%22AGENT%22%2C%22DIRECT%22%5D%2C%22canParking%22%3Afalse%2C%22isShortLease%22%3Afalse%2C%22hasElevator%22%3Afalse%2C%22hasPano%22%3Afalse%2C%22isDivision%22%3Afalse%2C%22isDuplex%22%3Afalse%7D&useMap=naver&zoom=9',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'd-api-version': '5.0.0',
                'd-call-type': 'web',
                csrf: 'token',
                accept: 'application/json, text/plain, */*',
            },
        }).then((res) => {
            return JSON.parse(res);
        });
        return stateList;
    }
    async region() {
        const bbox = {
            sw: { lat: 31, lng: 123 },
            ne: { lat: 38, lng: 130 },
        };
        const filters = {
            sellingTypeList: ['MONTHLY_RENT', 'LEASE', 'SELL'],
            tradeRange: { min: 0, max: 999999 },
            depositRange: { min: 0, max: 999999 },
            priceRange: { min: 0, max: 999999 },
            isIncludeMaintenance: false,
            pyeongRange: { min: 0, max: 999999 },
            useApprovalDateRange: { min: 0, max: 999999 },
            dealTypeList: ['AGENT', 'DIRECT'],
            householdNumRange: { min: 0, max: 999999 },
            parkingNumRange: { min: 0, max: 999999 },
            isShortLease: false,
            hasTakeTenant: false,
        };
        const { result: { cityList }, } = await (0, request_promise_native_1.default)({
            uri: 'https://www.dabangapp.com/api/v5/markers/category/apt',
            qs: {
                bbox: JSON.stringify(bbox),
                filters: JSON.stringify(filters),
                useMap: 'naver',
                zoom: 11,
            },
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'd-api-version': '5.0.0',
                'd-call-type': 'web',
                csrf: 'token',
                accept: 'application/json, text/plain, */*',
            },
        }).then((res) => {
            return JSON.parse(res);
        });
        return cityList;
    }
    async dong() {
        const bbox = {
            sw: { lat: 29, lng: 120 },
            ne: { lat: 40, lng: 135 },
        };
        const filters = {
            sellingTypeList: ['MONTHLY_RENT', 'LEASE'],
            depositRange: { min: 0, max: 11000 },
            priceRange: { min: 0, max: 999999 },
            isIncludeMaintenance: false,
            pyeongRange: { min: 20, max: 59 },
            useApprovalDateRange: { min: 0, max: 999999 },
            roomFloorList: ['GROUND_FIRST', 'GROUND_SECOND_OVER', 'SEMI_BASEMENT', 'ROOFTOP'],
            roomTypeList: ['ONE_ROOM', 'TWO_ROOM'],
            dealTypeList: ['AGENT', 'DIRECT'],
            canParking: false,
            isShortLease: false,
            hasElevator: false,
            hasPano: false,
            isDivision: false,
            isDuplex: false,
        };
        const dongList = await (0, request_promise_native_1.default)({
            uri: 'https://www.dabangapp.com/api/v5/markers/category/one-two',
            qs: {
                bbox: JSON.stringify(bbox),
                filters: JSON.stringify(filters),
                useMap: 'naver',
                zoom: 13,
            },
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'd-api-version': '5.0.0',
                'd-call-type': 'web',
                csrf: 'token',
                accept: 'application/json, text/plain, */*',
            },
        }).then((res) => {
            const data = JSON.parse(res);
            return data.result.dongList;
        });
        return dongList;
    }
    async setCookie() {
        const browser = await puppeteer_1.default.launch({
            headless: false,
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.goto('https://www.dabangapp.com/map/apt?m_lat=36.3821731&m_lng=127.3334185&m_zoom=11');
        return page;
    }
};
DabangService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [model_1.default])
], DabangService);
exports.default = DabangService;
//# sourceMappingURL=dabang.js.map