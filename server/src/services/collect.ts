import { Service } from "typedi";

import DabangService from "./dabang";
import NaverService from "./naver";
import ZigbangService from "./zigbang";

@Service()
export default class CollectService {
  constructor(
    private readonly naverService: NaverService,
    private readonly dabangService: DabangService,
    private readonly zigbangService: ZigbangService
  ) {}

  public async local() {
    const naverLocal = await this.naverService.collectLocal();
    const dabangLocal = await this.dabangService.collectLocal();
  }

  public async region() {}

  public async dong() {}
}
