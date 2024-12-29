import { Router, Request, Response } from 'express';
import Container from 'typedi';

import UserInstance from '../../services/user/user';
import { empty } from '../../utils/valid';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  // http://localhost:5000/api/user
  route.post('/', async (req: Request, res: Response) => {
    const UserService = Container.get(UserInstance);

    const { selectCodes, inputs } = req.body;

    const apiRes = {
      ok: true,
      msg: '',
      id: 0,
    };

    for await (const process of [1]) {
      if (empty(selectCodes)) {
        apiRes.ok = false;
        apiRes.msg = 'selectCodes 필수값입니다';
        break;
      }

      if (empty(inputs.sms) && empty(inputs.email)) {
        apiRes.ok = false;
        apiRes.msg = 'inputs 필수값입니다';
        break;
      }

      // ! 인증타입은 talk랑 sms는 같습니다 (DB 구조상 인증유형일 경우 talk는 sms로 INSERT 됩니다)
      const newSelectCodes = selectCodes.map((code: any) => {
        return code === 'talk' ? 'sms' : code;
      });

      //   if (selectCodes.length !== Object.values(inputs)) {
      //     apiRes.ok = false;
      //     apiRes.msg = 'selectCodes = inputs Length는 대칭되야합니다';
      //     break;
      //   }
      try {
        let user: any = {};

        if (!empty(inputs.sms)) {
          user = await UserService.getUserCustomQuery({
            where: [`sms = '${inputs.sms}'`],
            type: 'row',
          });
        }

        if (!empty(inputs.email)) {
          user = await UserService.getUserCustomQuery({
            where: [`email = '${inputs.email}'`],
            type: 'row',
          });
        }

        if (!empty(user)) {
          apiRes.id = user.seq;
          break;
        }

        const insertUserSeq = await UserService.makeUser(newSelectCodes, inputs);
        if (!insertUserSeq) {
          apiRes.ok = false;
          apiRes.msg = '알수없는 오류가 발생하였습니다';
          break;
        }

        apiRes.id = insertUserSeq;
      } catch (error) {
        console.log(error);
        apiRes.ok = false;
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }
    }

    return res.status(200).json(apiRes);
  });
};
