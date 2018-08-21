import { Router } from 'express';

import users from './users';
import authRoute from './socialAuthorize';
import articlesRoute from './articleRoutes';

const router = Router();

router.use('/', users);
router.use('/users/login', authRoute);
router.use('/', articlesRoute);

export default router;
