/**
 * SOLAPI (문자 & 알림톡)
 */
import { Service } from 'typedi';
import { SolapiMessageService } from 'solapi';

import config from '../../config';

@Service()
export default class solapiService {
  private messageService: any;

  constructor() {
    // Solapi 서비스 객체 생성
    const apiKey = config.solapi.api_key as string;
    const apiSecret = config.solapi.secret_key as string;

    this.messageService = new SolapiMessageService(apiKey, apiSecret);
  }

  public async sendSMS(to: string, msg: string) {
    let res = null;

    console.log(to, msg);

    try {
      res = await this.messageService.sendOne({
        to: to, // 예: '01012345678'
        from: '01056539944', // 예: '0212345678'
        text: msg,
      });
      console.log('SMS 전송 성공:', res);
    } catch (error) {
      console.error('SMS 전송 실패:', error);
    }

    return res;
  }

  public async sendTALK(to: string, msg: string) {
    return {};
  }
}
