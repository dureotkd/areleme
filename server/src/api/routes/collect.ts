import { Router, Request, Response } from 'express';
import Container from 'typedi';

import CollectServiceInstance from '../../services/collect/collect';

const route = Router();

export default (app: Router) => {
  app.use('/collect', route);

  // http://localhost:5000/api/collect/local
  route.get('/local', async (req: Request, res: Response) => {
    const { type = '' } = req.query;

    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverLocal();
    await collectService.saveDabangLocal();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:5000/api/collect/region
  route.get('/region', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverRegion();
    await collectService.saveDabangRegion();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:5000/api/collect/dong
  route.get('/dong', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverDong();
    await collectService.saveDabangDong();

    return res.status(200).json({ message: 'Success' });
  });
};
