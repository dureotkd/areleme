/**
 * 뿌리오 (문자 & 알림톡)
 */

import { Service } from 'typedi';

@Service()
export default class PPurioService {
  constructor() {}

  public async sendSMS(to: string, msg: string) {
    return {};
  }

  public async sendTALK(to: string, msg: string) {
    return {};
  }
}
