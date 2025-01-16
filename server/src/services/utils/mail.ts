import { Service } from 'typedi';
import nodemailer from 'nodemailer';

import config from '../../config';

@Service()
export default class mailService {
  constructor() {}

  public async send(to: string, subject: string = '', msg: string) {
    let res = null;

    try {
      const mailer = nodemailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com', // SMTP 서버명
        port: 465, // SMTP 포트
        auth: {
          user: config.naver.user_id, // 네이버 아이디
          pass: config.naver.user_pw, // 발급하여 저장한 비밀 번호
        },
      });

      res = await mailer.sendMail({
        from: `${config.naver.user_id}@naver.com`,
        to: to,
        subject: `매물 알리미 ${subject}`,
        html: msg,
      });
    } catch (error) {
      console.log(error);
    }

    return res;
  }

  public async save() {}

  public async delete() {}
}
