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
const trsnform_1 = require("../utils/trsnform");
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
    async local() {
        const naverLocal = (0, trsnform_1.transformNaverLocal)(await this.naverService.local());
        const dabangLocal = (0, trsnform_1.transformDabangLocal)(await this.dabangService.local());
        const localList = [...naverLocal, ...dabangLocal];
        for await (const row of localList) {
            const localRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.local WHERE code = '${row.code}' AND type = '${row.type}'`,
                type: "row",
            });
            if ((0, valid_1.empty)(localRow)) {
                const insertQuery = this.modelService.getInsertQuery({
                    table: "areleme.local",
                    data: row,
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: "exec",
                    debug: false,
                });
            }
        }
    }
    async region() {
        const naverRegion = (0, trsnform_1.transformNaverRegion)(await this.naverService.region());
        for await (const [localCode, regions] of Object.entries(naverRegion)) {
            console.log(localCode, regions.length);
            for await (const row of regions) {
                const regionRow = await this.modelService.excute({
                    sql: `SELECT * FROM areleme.region WHERE code = '${row.code}' AND type = '${row.type}' AND localCode = '${localCode}'`,
                    type: "row",
                });
                if ((0, valid_1.empty)(regionRow)) {
                    const insertQuery = this.modelService.getInsertQuery({
                        table: "areleme.region",
                        data: {
                            ...row,
                            localCode: localCode,
                        },
                    });
                    await this.modelService.excute({
                        sql: insertQuery,
                        type: "exec",
                        debug: false,
                    });
                }
            }
        }
    }
    async dong() {
        const naverDong = (0, trsnform_1.transformNaverDong)(await this.naverService.dong());
        for await (const row of naverDong) {
            const regionRow = await this.modelService.excute({
                sql: `SELECT * FROM areleme.dong WHERE code = '${row.code}' AND type = '${row.type}' AND localCode = '${row.localCode}' AND regionCode = '${row.regionCode}'`,
                type: "row",
            });
            if ((0, valid_1.empty)(regionRow)) {
                const insertQuery = this.modelService.getInsertQuery({
                    table: "areleme.dong",
                    data: {
                        ...row,
                        localCode: row.localCode,
                        regionCode: row.regionCode,
                    },
                });
                await this.modelService.excute({
                    sql: insertQuery,
                    type: "exec",
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