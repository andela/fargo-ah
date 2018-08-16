import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import countReadTime from '../../helpers/calculateReadTime';
import app from '../../index';
import seedData from './seed/seed';
import sendEmail from '../../helpers/sendEmail';

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
  let articleSlug;
  it('Should get an empty array for no articles', (done) => {
    chai.request(app)
      .get('/api/articles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('Sorry, no articles created');
        expect(res.body).to.have.property('articles').to.be.an('array').with.lengthOf(0);
        done();
      });
  });

  it('Should return an empty array when no tags are created', (done) => {
    chai.request(app)
      .get('/api/tags')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('No tags created');
        expect(res.body.tags.length).to.equal(0);
        done();
      });
  });

  it('Should register user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(validUser)
      .end((err, res) => {
        validToken = res.body.user.token;
        expect(res).to.have.status(200);
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
      .set('authorization', `Bearer ${validToken}sdfdd`)
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
        articleSlug = createdArticle.slug;
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

  it('should not send an email if invalid email is provided', (done) => {
    const emailData = {
      email: 'rossidiuebr@gmail.com',
      slug: articleSlug,
      name: 'Nwanna'
    };
    sendEmail(emailData.email, emailData.name, emailData.slug, (callback) => {
      expect(callback).to.equal('Mail address not found');
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
  it('Should not create article if Article is to be paid for, but price is not set', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send({
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'You have to believe',
          price: '',
          isPaidFor: true
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.body[0]).to.equal('Article is to be paid for, but price is not set');
        done();
      });
  });

  it('Should not create article if price of article is less than the lower price boundary', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send({
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'You have to believe',
          price: 0.15,
          isPaidFor: true
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.body[0]).to.equal('Price can only be between $0.28 to $5.53');
        done();
      });
  });
  it('Should not create article if price of article is more than the higher price boundary', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send({
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'You have to believe',
          price: 15.15,
          isPaidFor: true
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.body[0]).to.equal('Price can only be between $0.28 to $5.53');
        done();
      });
  });
  it('Should not create article if price is not a number', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${validToken}`)
      .send({
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'You have to believe',
          price: 'two dollars',
          isPaidFor: true
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.body[0]).to.equal('Article price must be in figure');
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
        expect(res.body.articles).to.be.an('array');
        expect(res.body.articlesCount).to.equal(res.body.articles.length);
        done();
      });
  });
  it('Should return empty array for query that exceeds number of articles during pagination', (done) => {
    chai.request(app)
      .get('/api/articles?page=20')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('articles limit exceeded');
        expect(res.body.articlesCount).to.equal(res.body.articles.length);
        done();
      });
  });
  it('Should paginate articles when limit and page is provided', (done) => {
    chai.request(app)
      .get('/api/articles?page=1&limit=10')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array').with.lengthOf(1);
        expect(res.body.articlesCount).to.equal(res.body.articles.length);
        done();
      });
  });

  it('Should paginate articles when only page query is provided', (done) => {
    chai.request(app)
      .get('/api/articles?page=1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array').with.lengthOf(1);
        expect(res.body.articlesCount).to.equal(res.body.articles.length);
        done();
      });
  });

  it('Should paginate articles when page query is less than 1', (done) => {
    chai.request(app)
      .get('/api/articles?page=0')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array').with.lengthOf(1);
        expect(res.body.articlesCount).to.equal(res.body.articles.length);
        done();
      });
  });

  it('Should paginate articles when limit query is less than 1', (done) => {
    chai.request(app)
      .get('/api/articles?limit=0')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array').with.lengthOf(1);
        expect(res.body.articlesCount).to.equal(res.body.articles.length);
        done();
      });
  });


  it('Should paginate articles when only limit query is provided', (done) => {
    chai.request(app)
      .get('/api/articles?limit=5')
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

  it('Should update count to 2 after updating an article twice', (done) => {
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

  it('Should update count to 3 after updating an article three times', (done) => {
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
  it('Should allow a user like an article successfully', (done) => {
    chai.request(app)
      .put('/api/articles/1/like')
      .set('authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('totalLikes').to.equal(1);
        done();
      });
  });
  it('Should allow a user unlike an article already liked successfully', (done) => {
    chai.request(app)
      .put('/api/articles/1/like')
      .set('authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('totalLikes').to.equal(0);
        done();
      });
  });
  it('Should not allow a user like an article with non-integer article id in the parameter', (done) => {
    chai.request(app)
      .put('/api/articles/fgh/like')
      .set('authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.errors.id)
          .to.include('The parameter id must be an integer.');
        done();
      });
  });
  it('Should not allow a user like an article if token is wrong', (done) => {
    chai.request(app)
      .put('/api/articles/1/like')
      .set('authorization', `Bearer ${validToken}sdfdg`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('Should not allow a user like an article with non-existing article id in the parameter', (done) => {
    chai.request(app)
      .put('/api/articles/50/like')
      .set('authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.errors.body).to.be.an('array');
        expect(res.body.errors.body[0]).to.equal('Ooops! the article cannot be found.');
        done();
      });
  });

  it('Should get all tags created', (done) => {
    chai.request(app)
      .get('/api/tags')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.tags.length).to.not.equal(0);
        done();
      });
  });

  it('Should delete an article created by a user', (done) => {
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
  it('Should not delete an article created by a user if token is wrong', (done) => {
    chai.request(app)
      .delete(`/api/articles/${createdArticle.slug}`)
      .set('authorization', `Bearer ${validToken}sdfg`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('Should not delete an article created by a user if article does not exist', (done) => {
    chai.request(app)
      .delete(`/api/articles/${createdArticle.slug}sdf@`)
      .set('authorization', `Bearer ${validToken}`)
      .send(editedArticle)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('Should count how long it takes to read an article', (done) => {
    assert.equal(countReadTime(460), 2);
    done();
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
  it('Should search for articles by tag****', (done) => {
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
      .get('/api/articles?author=Lumexata')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').to.have.property('message').to.equal('No article found for your search');
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
