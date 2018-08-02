import { Router } from 'express';

import users from './users';
import authRoute from './socialAuthorize';

const router = Router();

router.use('/', users);
router.use('/users/login', authRoute);

export default router;
