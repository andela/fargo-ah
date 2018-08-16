import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';
import seedData from './seed/seed';

chai.use(chaiHttp);
const {
  validUser,
  validArticleData,
  validArticleData2,
  dataWithNoTitle,
  dataWithNoDescription,
  dataWithNoBody,
  editedArticle,
} = seedData;
let validToken, createdArticle;

describe('Articles API endpoints', () => {
  it('Should get an empty array for no articles', (done) => {
    chai.request(app)
      .get('/api/articles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('No articles created');
        expect(res.body).to.have.property('articles').to.be.an('array').with.lengthOf(0);
        done();
      });
  });
  it('Should register user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(validUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        validToken = res.body.user.token;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should not allow non-authenticated user create article', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', '')
      .send(validArticleData)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should not allow user with invalid token create article', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}sdd`)
      .send(validArticleData)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should create article with required fields for authenticated user', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send(validArticleData)
      .end((err, res) => {
        createdArticle = res.body.article;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object').to.have.property('article');
        expect(createdArticle).to.be.an('object').to.have.property('slug');
        expect(createdArticle.slug).to.be.a('string');
        expect(createdArticle.title).to.equal(validArticleData.article.title);
        expect(createdArticle.body).to.equal(validArticleData.article.body);
        expect(createdArticle.description).to.equal(validArticleData.article.description);
        expect(createdArticle.tagList).to.be.an('array').with.lengthOf(validArticleData.article.tagList.length);
        expect(createdArticle.User).to.be.an('object').to.have.property('username').to.equal(validUser.user.username);
        expect(createdArticle.User).to.have.property('bio');
        expect(createdArticle.User).to.have.property('image');
        done();
      });
  });

  it('Should not create article with missing title field for authenticated user', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send(dataWithNoTitle)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object').to.have.property('errors').to.have.property('body');
        expect(res.body.errors.body).to.be.an('array').with.lengthOf(1);
        expect(res.body.errors.body[0]).to.equal('Please check that your title, description or body field is not empty');
        done();
      });
  });

  it('Should not create article with missing description field for authenticated user', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send(dataWithNoDescription)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object').to.have.property('errors').to.have.property('body');
        expect(res.body.errors.body).to.be.an('array').with.lengthOf(1);
        expect(res.body.errors.body[0]).to.equal('Please check that your title, description or body field is not empty');
        done();
      });
  });

  it('Should not create article with missing title field for authenticated user', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send(dataWithNoTitle)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object').to.have.property('errors').to.have.property('body');
        expect(res.body.errors.body).to.be.an('array').with.lengthOf(1);
        expect(res.body.errors.body[0]).to.equal('Please check that your title, description or body field is not empty');
        done();
      });
  });

  it('Should not create article with missing article field', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send({
        article: ''
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object').to.have.property('errors').to.have.property('body');
        expect(res.body.errors.body).to.be.an('array').with.lengthOf(1);
        expect(res.body.errors.body[0]).to.equal('Please check that article field is present');
        done();
      });
  });

  it('Should not create article with missing body field for authenticated user', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send(dataWithNoBody)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object').to.have.property('errors').to.have.property('body');
        expect(res.body.errors.body).to.be.an('array').with.lengthOf(1);
        expect(res.body.errors.body[0]).to.equal('Please check that your title, description or body field is not empty');
        done();
      });
  });

  it('Should return error for invalid slug parameter', (done) => {
    chai.request(app)
      .get('/api/articles/chaihttp-13455')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object').to.have.property('errors').to.have.property('body');
        expect(res.body.errors.body).to.be.an('array').with.lengthOf(1);
        expect(res.body.errors.body[0]).to.equal('Ooops! the article cannot be found.');
        done();
      });
  });

  it('Should get an article with valid slug parameter', () => {
    chai.request(app)
      .get(`/api/articles/${createdArticle.slug}`)
      .end((err, res) => {
        const returnedArticle = res.body.article;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('article');
        expect(returnedArticle).to.have.property('slug').to.equal(createdArticle.slug);
        expect(returnedArticle).to.have.property('title').to.equal(createdArticle.title);
        expect(returnedArticle).to.have.property('title').not.to.equal(createdArticle.slug);
        expect(returnedArticle).to.have.property('description').to.equal(createdArticle.description);
        expect(returnedArticle).to.have.property('body').to.equal(createdArticle.body);
        expect(returnedArticle).to.have.property('User').to.be.an('object');
        expect(returnedArticle.User).to.have.property('username').to.equal(validUser.user.username);
      });
  });

  it('Should get all created articles', (done) => {
    chai.request(app)
      .get('/api/articles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array').with.lengthOf(1);
        expect(res.body.articlesCount).to.equal(res.body.articles.length);
        done();
      });
  });

  it('Should be able to edit an article created by a user', (done) => {
    chai.request(app)
      .put(`/api/articles/${createdArticle.slug}`)
      .set('authorization', `Bearer ${validToken}`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.have.status(200);
        expect(res.body.article.title).to.equal(editedArticle.article.title);
        expect(res.body.article.body).to.equal(editedArticle.article.body);
        expect(res.body.article.description).to.equal(editedArticle.article.description);
        expect(res.body.article.tagList).to.be.an('array').with.lengthOf(editedArticle.article.tagList.length);
        done();
      });
  });

  it('Should not update an article if the slug is incorrect', (done) => {
    chai.request(app)
      .put(`/api/articles/${createdArticle.slug}adf`)
      .set('authorization', `Bearer ${validToken}`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.errors.body).to.be.an('array');
        expect(res.body.errors.body[0]).to.equal('this article does not exist');
        done();
      });
  });

  it('Should update count to 1 after updating an article', (done) => {
    chai.request(app)
      .put(`/api/articles/${createdArticle.slug}`)
      .set('authorization', `Bearer ${validToken}`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.article.updatedCount).to.equal(2);
        done();
      });
  });

  it('Should update count to 2 after updating an article', (done) => {
    chai.request(app)
      .put(`/api/articles/${createdArticle.slug}`)
      .set('authorization', `Bearer ${validToken}`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.article.updatedCount).to.equal(3);
        done();
      });
  });

  it('Should not update after three(3) times', (done) => {
    chai.request(app)
      .put(`/api/articles/${createdArticle.slug}`)
      .set('authorization', `Bearer ${validToken}`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.errors.body).to.be.an('array');
        done();
      });
  });
  it('Should delete an article created by a user', (done) => {
    chai.request(app)
      .delete(`/api/articles/${createdArticle.slug}`)
      .set('authorization', `Bearer ${validToken}`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Article successfully deleted');
        done();
      });
  });

  it('Should create article with required fields for authenticated user', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send(validArticleData2)
      .end((err, res) => {
        createdArticle = res.body.article;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object').to.have.property('article');
        expect(createdArticle).to.be.an('object').to.have.property('slug');
        expect(createdArticle.slug).to.be.a('string');
        expect(createdArticle.title).to.equal(validArticleData.article.title);
        expect(createdArticle.body).to.equal(validArticleData.article.body);
        expect(createdArticle.description).to.equal(validArticleData.article.description);
        expect(createdArticle.User).to.be.an('object').to.have.property('username').to.equal(validUser.user.username);
        expect(createdArticle.User).to.have.property('bio');
        expect(createdArticle.User).to.have.property('image');
        done();
      });
  });
  // Articles by search
  it('Should not find articles by the wrong title', (done) => {
    chai.request(app)
      .get('/api/articles/?title=fiction')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('No article found for your search');
        done();
      });
  });
});
describe('Articles Search by Criteria', () => {
  it('Should search for articles by tag', (done) => {
    chai.request(app)
      .get('/api/articles?tag=fiction')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('These are the articles found');
        done();
      });
  });
  it('Should search for articles by title', (done) => {
    chai.request(app)
      .get('/api/articles?title=train')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('These are the articles found');
        done();
      });
  });
  it('Should search for articles by author', (done) => {
    chai.request(app)
      .get('/api/articles?author=Lumexat')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('These are the articles found');
        done();
      });
  });
  it('Should not return any search result for articles not found', (done) => {
    chai.request(app)
      .get('/api/articles?author=Lumexx')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('No article found for your search');
        done();
      });
  });
});
