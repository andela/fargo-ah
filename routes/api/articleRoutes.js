import { Router } from 'express';
import multiparty from 'connect-multiparty';
import validatePrice from '../../middlewares/validatePrice';
import ArticleControllers from '../../controllers/ArticleController';
import validateArticle from '../../middlewares/validateArticle';
import verifyToken from '../../middlewares/verifyToken';
import ParamsValidator from '../../middlewares/ParamsValidator';
import idIsInteger from '../../middlewares/idIsInteger';
import checkArticle from '../../middlewares/checkArticle';
import { checkCount, articleExists } from '../../middlewares/checkUser';
import getArticle from '../../middlewares/getArticle';
import toggleFree from '../../middlewares/toggleFree';
import searchForArticles from '../../middlewares/searchArticles';
import { listOfCategories } from '../../helpers/exports';

const fileParser = multiparty();

const router = Router();

router.post(
  '/articles',
  [fileParser],
  verifyToken,
  validateArticle,
  validatePrice,
  ArticleControllers.createArticle
);
router.put(
  '/articles/:slug',
  [fileParser],
  validateArticle,
  validatePrice,
  verifyToken,
  articleExists,
  checkCount,
  ArticleControllers.editArticle
);
router.delete(
  '/articles/:slug',
  verifyToken,
  articleExists,
  ArticleControllers.deleteArticle
);
router.get(
  '/articles/:slug',
  getArticle,
  toggleFree,
  ArticleControllers.getArticle
);
router.get(
  '/articles',
  ParamsValidator.validatePageQuery,
  ArticleControllers.listAllArticles,
  searchForArticles
);
router.get(
  '/user/articles/:username',
  ParamsValidator.validatePageQuery,
  ArticleControllers.getAllUserArticles,
);
router.post(
  '/articles/:slug/like',
  verifyToken,
  ArticleControllers.likeArticle,
);

router.put(
  '/articles/:id/like',
  verifyToken,
  idIsInteger,
  checkArticle,
  ArticleControllers.likeArticle
);
// router.post('/articles', verifyToken, validateArticle, validatePrice, ArticleControllers.createArticle);

// router.put('/articles/:slug', validateArticle, validatePrice, verifyToken, articleExists, checkCount, ArticleControllers.editArticle);

// router.delete('/articles/:slug', verifyToken, articleExists, ArticleControllers.deleteArticle);

// router.get('/articles/:slug', ArticleControllers.getArticle);

// router.get('/articles', ParamsValidator.validatePageQuery, ArticleControllers.listAllArticles);

router.put('/articles/:slug', validateArticle, validatePrice, verifyToken, articleExists, checkCount, ArticleControllers.editArticle);

router.delete('/articles/:slug', verifyToken, articleExists, ArticleControllers.deleteArticle);

router.get('/articles/:slug', ArticleControllers.getArticle);

router.get('/articles', ParamsValidator.validatePageQuery, ArticleControllers.listAllArticles);

router.get('/tags', ArticleControllers.getAllTags);
router.get('/articles/list/categories', listOfCategories);

export default router;
