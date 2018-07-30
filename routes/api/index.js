import { Router } from 'express';

import users from './users';
import authRoute from './socialAuthorize';
import articlesRoute from './articleRoutes';
import comments from './comments';

const router = Router();

router.use('/', users);
router.use('/', articlesRoute);
router.use('/', comments);
router.use('/users/login', authRoute);
router.use('/', articlesRoute);
router.use('/', comments);
router.use('/users/login', authRoute);

export default router;
