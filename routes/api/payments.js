import { Router } from 'express';

import PaymentController from '../../controllers/PaymentController';
import getArticle from '../../middlewares/getArticle';
import verifyToken from '../../middlewares/verifyToken';
import getUser from '../../middlewares/getUser';
import beforePayment from '../../middlewares/beforePayment';

const router = Router();

router.post(
  '/pay/:slug',
  verifyToken,
  getUser,
  getArticle,
  beforePayment,
  PaymentController.makePayment
);

router.post(
  '/pay/:slug/success',
  verifyToken,
  getUser,
  getArticle,
  PaymentController.afterPayment
);

export default router;
