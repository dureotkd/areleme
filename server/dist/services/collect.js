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
let CollectService = class CollectService {
    naverService;
    dabangService;
    zigbangService;
    constructor(naverService, dabangService, zigbangService) {
        this.naverService = naverService;
        this.dabangService = dabangService;
        this.zigbangService = zigbangService;
    }
    async local() {
        const naverLocal = await this.naverService.collectLocal();
        const dabangLocal = await this.dabangService.collectLocal();
    }
    async region() { }
    async dong() { }
};
CollectService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [naver_1.default,
        dabang_1.default,
        zigbang_1.default])
], CollectService);
exports.default = CollectService;
//# sourceMappingURL=collect.js.map