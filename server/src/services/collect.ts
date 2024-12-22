import { Service } from "typedi";

import DabangService from "./dabang";
import NaverService from "./naver";
import ZigbangService from "./zigbang";
import ModelService from "./core/model";

import {
  transformNaverLocal,
  transformDabangLocal,
  transformNaverRegion,
  transformNaverDong,
} from "../utils/trsnform";
import { empty } from "../utils/valid";

@Service()
export default class CollectService {
  constructor(
    private readonly naverService: NaverService,
    private readonly dabangService: DabangService,
    private readonly zigbangService: ZigbangService,
    private readonly modelService: ModelService
  ) {}

  public async local() {
    const naverLocal = transformNaverLocal(await this.naverService.local());
    const dabangLocal = transformDabangLocal(await this.dabangService.local());

    const localList = [...naverLocal, ...dabangLocal];

    for await (const row of localList) {
      const localRow = await this.modelService.excute({
        sql: `SELECT * FROM areleme.local WHERE code = '${row.code}' AND type = '${row.type}'`,
        type: "row",
      });

      if (empty(localRow)) {
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

  public async region() {
    const naverRegion = transformNaverRegion(await this.naverService.region());

    for await (const [localCode, regions] of Object.entries(naverRegion)) {
      console.log(localCode, regions.length);
      for await (const row of regions) {
        const regionRow = await this.modelService.excute({
          sql: `SELECT * FROM areleme.region WHERE code = '${row.code}' AND type = '${row.type}' AND localCode = '${localCode}'`,
          type: "row",
        });

        if (empty(regionRow)) {
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

  public async dong() {
    const naverDong = transformNaverDong(await this.naverService.dong());

    for await (const row of naverDong) {
      const regionRow = await this.modelService.excute({
        sql: `SELECT * FROM areleme.dong WHERE code = '${row.code}' AND type = '${row.type}' AND localCode = '${row.localCode}' AND regionCode = '${row.regionCode}'`,
        type: "row",
      });
      if (empty(regionRow)) {
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
}
