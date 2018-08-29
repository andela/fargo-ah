import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';
import seedData from './seed/seed';
import db from '../../models';

const {
  validComment,
  validReply,
  invalidComment,
  commentWithoutBody,
  commentNotString,
} = seedData;
const { Article } = db;

chai.use(chaiHttp);

let validToken;

describe('Tests for comment controller', () => {
  before('save article', (done) => {
    Article
      .create({
        slug: 'how-to-train-your-dragon-cjkjul5200000govbk1904gde',
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        body: 'You have to believe',
        updatedCount: 0,
        userId: 1,
        tagList: [
          'reactjs',
          'angularjs',
          'dragons'
        ],
        imageUrl: 'https://randomuser.me/api/portraits/men/71.jpg',
      });
    done();
  });

  describe('Login a user for token use', () => {
    it('Should log a user in', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send({
          user: {
            email: 'newuser@register.com',
            password: 'password123'
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          validToken = res.body.user.token;
          done();
        });
    });
  });
  describe('Tests for comment', () => {
    it('Should not allow non-authenticated user create comment', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .send(validComment)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should not allow non-authenticated user create comment', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .send(validComment)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should create a comment if required fields are present', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .set('authorization', `Bearer ${validToken}`)
        .send(validComment)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('comment');
          expect(res.body.comment).to.be.an('object').to.have.property('body');
          done();
        });
    });
    it('Should not create a comment if token is invalid', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .set('authorization', `Bearer ${validToken}sdfd`)
        .send(validComment)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should not create a comment if comment body is empty', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .set('authorization', `Bearer ${validToken}`)
        .send(commentWithoutBody)
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
    it('Should not create a comment if comment body is not a string', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .set('authorization', `Bearer ${validToken}`)
        .send(commentNotString)
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
    it('Should not create a comment if comment body is absent', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .set('authorization', `Bearer ${validToken}`)
        .send(invalidComment)
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
    it('Should not get comments where article does not exist', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904/comments')
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it('Should get comments where article does exists', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('Tests for comment replies', () => {
    it('Should not allow non-authenticated user create reply', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/1')
        .send(validReply)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should create a reply if required fields are present', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/1')
        .set('authorization', `Bearer ${validToken}`)
        .send(validReply)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('comment');
          expect(res.body.comment).to.be.an('object').to.have.property('body');
          done();
        });
    });
    it('Should not create a reply if token is invalid', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/1')
        .set('authorization', `Bearer ${validToken}sdfd`)
        .send(validReply)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should not create a reply if comment does not exist', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/0')
        .set('authorization', `Bearer ${validToken}`)
        .send(validReply)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it('Should not create a reply if required fields are absent', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/1')
        .set('authorization', `Bearer ${validToken}`)
        .send(invalidComment)
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
  });
  describe('Tests for delete comment', () => {
    it('Should not delete comment where id is not a valid integer', (done) => {
      chai.request(app)
        .delete('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/sdf')
        .set('authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
    it('Should not delete comment where comment does not exist', (done) => {
      chai.request(app)
        .delete('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/0')
        .set('authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it('Should delete comment where id is a valid integer', (done) => {
      chai.request(app)
        .delete('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904gde/comments/1')
        .set('authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
