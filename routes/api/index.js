import { Router } from 'express';

import users from './users';
import articlesRoute from './articleRoutes';

const router = Router();

router.use('/', users);
router.use('/', articlesRoute);

export default router;
