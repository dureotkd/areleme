import { Router, Request, Response } from 'express';
import Container from 'typedi';

import AuthInstance from '../../services/auth/auth';
import { isValidEmail } from '../../utils/string';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  // http://localhost:5000/api/auth/sms
  route.post('/sms', async (req: Request, res: Response) => {
    const AuthService = Container.get(AuthInstance);

    const sms = (req?.body?.sms || '') as string;

    const apiRes = {
      ok: true,
      msg: '전송되었습니다',
    };

    for await (const process of [1]) {
      if (sms === '') {
        apiRes.ok = false;
        apiRes.msg = '전화번호를 입력해주세요';
        break;
      }

      const sendCodeRes = await AuthService.sendCode(sms, 'sms');

      if (!sendCodeRes.ok) {
        apiRes.ok = false;
        apiRes.msg = '인증번호 전송에 실패하였습니다';
        break;
      }
    }

    return res.status(200).json(apiRes);
  });

  route.post('/email', async (req: Request, res: Response) => {
    const AuthService = Container.get(AuthInstance);

    const body = req.body;
    const email = (body?.email || '') as string;

    const apiRes = {
      ok: true,
      msg: '전송되었습니다',
    };

    for await (const process of [1]) {
      if (email === '') {
        apiRes.ok = false;
        apiRes.msg = '이메일을 입력해주세요';
        break;
      }

      console.log(email);

      if (isValidEmail(email)) {
        apiRes.ok = false;
        apiRes.msg = '이메일 유형을 확인해주세요';
        break;
      }

      try {
        const sendCodeRes = await AuthService.sendCode(email, 'email');

        if (!sendCodeRes.ok) {
          apiRes.ok = false;
          apiRes.msg = '인증번호 전송에 실패하였습니다';
          break;
        }
      } catch (error) {
        console.log(error);
        apiRes.ok = false;
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }
    }

    return res.status(200).json(apiRes);
  });

  route.post('/verfiy', async (req: Request, res: Response) => {
    const AuthService = Container.get(AuthInstance);

    const type = (req?.body?.type || '') as string;
    const to = (req?.body[type] || '') as string;
    const code = (req?.body?.code || '') as string;

    const apiRes = {
      ok: true,
      msg: '인증되었습니다',
    };

    for await (const process of [1]) {
      if (to === '') {
        apiRes.ok = false;
        apiRes.msg = '이메일 또는 전화번호를 입력해주세요';
        break;
      }

      if (code === '') {
        apiRes.ok = false;
        apiRes.msg = '인증번호를 입력해주세요';
        break;
      }

      try {
        const isVertify = await AuthService.vertifyCode({
          type: type,
          to: to,
          code: code,
        });

        if (!isVertify) {
          apiRes.ok = false;
          apiRes.msg = '인증번호가 틀립니다';
          break;
        }
      } catch (error) {
        apiRes.ok = false;
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        console.log(error);
        break;
      }
    }

    return res.status(200).json(apiRes);
  });
};
