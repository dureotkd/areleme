import { Router, Request, Response } from 'express';
import Container from 'typedi';

import AuthInstance from '../../services/auth/auth';
import { isValidEmail } from '../../utils/string';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  // http://localhost:5000/auth/sms
  route.post('/sms', async (req: Request, res: Response) => {
    const AuthService = Container.get(AuthInstance);

    const sms = (req?.body?.sms || '') as string;

    const apiRes = {
      code: 'success',
      msg: '전송되었습니다',
    };

    for await (const process of [1]) {
      if (sms === '') {
        apiRes.code = 'fail';
        apiRes.msg = '전화번호를 입력해주세요';
        break;
      }

      try {
        const sendCodeRes = await AuthService.sendCode(sms, 'sms');

        if (!sendCodeRes.ok) {
          apiRes.code = 'fail';
          apiRes.msg = '인증번호 전송에 실패하였습니다';
          break;
        }
      } catch (error) {
        console.log(error);
        apiRes.code = 'fail';
        apiRes.msg = '서버 오류가 발생하였습니다';
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
      code: 'success',
      msg: '전송되었습니다',
    };

    for await (const process of [1]) {
      if (email === '') {
        apiRes.code = 'fail';
        apiRes.msg = '이메일을 입력해주세요';
        break;
      }

      if (isValidEmail(email)) {
        apiRes.code = 'fail';
        apiRes.msg = '이메일 유형을 확인해주세요';
        break;
      }

      try {
        const sendCodeRes = await AuthService.sendCode(email, 'email');

        if (!sendCodeRes.ok) {
          apiRes.code = 'fail';
          apiRes.msg = '인증번호 전송에 실패하였습니다';
          break;
        }
      } catch (error) {
        console.log(error);
        apiRes.code = 'fail';
        apiRes.msg = '서버 오류가 발생하였습니다';
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
      code: 'success',
      msg: '인증되었습니다',
    };

    for await (const process of [1]) {
      if (to === '') {
        apiRes.code = 'fail';
        apiRes.msg = '이메일 또는 전화번호를 입력해주세요';
        break;
      }

      if (code === '') {
        apiRes.code = 'fail';
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
          apiRes.code = 'fail';
          apiRes.msg = '인증번호가 다릅니다';
          break;
        }
      } catch (error) {
        apiRes.code = 'fail';
        apiRes.msg = '서버 오류가 발생하였습니다';
        console.log(error);
        break;
      }
    }

    return res.status(200).json(apiRes);
  });
};
