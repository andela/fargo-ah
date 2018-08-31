import { Router } from 'express';
import validatePrice from '../../middlewares/validatePrice';
import ArticleControllers from '../../controllers/ArticleController';
import validateArticle from '../../middlewares/validateArticle';
import verifyToken from '../../middlewares/verifyToken';
import ParamsValidator from '../../middlewares/ParamsValidator';
import idIsInteger from '../../middlewares/idIsInteger';
import checkArticle from '../../middlewares/checkArticle';
import { checkCount, articleExists } from '../../middlewares/checkUser';


const router = Router();


router.post('/articles', verifyToken, validateArticle, validatePrice, ArticleControllers.createArticle);

router.put('/articles/:slug', validateArticle, validatePrice, verifyToken, articleExists, checkCount, ArticleControllers.editArticle);

router.delete('/articles/:slug', verifyToken, articleExists, ArticleControllers.deleteArticle);

router.get('/articles/:slug', ArticleControllers.getArticle);

router.get('/articles', ParamsValidator.validatePageQuery, ArticleControllers.listAllArticles);

router.put('/articles/:id/like', verifyToken, idIsInteger, checkArticle, ArticleControllers.likeArticle);

export default router;
