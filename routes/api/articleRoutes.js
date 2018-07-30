import { Router } from 'express';

import ArticleControllers from '../../controllers/ArticleController';
import validateArticle from '../../middlewares/validateArticle';
import verifyToken from '../../middlewares/verifyToken';
import { checkCount, articleExists } from '../../middlewares/checkUser';


const router = Router();


router.post('/articles', verifyToken, validateArticle, ArticleControllers.createArticle);
router.put('/articles/:slug', validateArticle, verifyToken, articleExists, checkCount, ArticleControllers.editArticle);
router.delete('/articles/:slug', verifyToken, articleExists, ArticleControllers.deleteArticle);
router.get('/articles/:slug', ArticleControllers.getArticle);
router.get('/articles', ArticleControllers.listAllArticles);

export default router;
