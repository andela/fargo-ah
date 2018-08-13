import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';
import seedData from './seed/seed';
import db from '../../models';
import PaymentController from '../../controllers/PaymentController';

chai.use(chaiHttp);
const { Article, Payment } = db;
const {
  userForPayment,
  paymentData,
} = seedData;

let validToken;

describe('Payment Controller', () => {
  before('save article', (done) => {
    Article
      .create({
        slug: 'how-to-train-your-dragon-cjkjul5200000govbk1904',
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
    Payment
      .create(paymentData);
    Article
      .create({
        slug: 'how-to-train-your-dragon-cjkjul5200000govbk1904space',
        title: 'How to train your dragon Paid Not Bought',
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
        isPaidFor: true,
        price: 1.20,
      });
    done();
  });
  describe('Login a user for token use', () => {
    it('Should log a user in', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(userForPayment)
        .end((err, res) => {
          expect(res).to.have.status(200);
          validToken = res.body.user.token;
          done();
        });
    });
  });
  describe('Tests some payment functions', () => {
    it('return an object for Stripe token', (done) => {
      const stripe = PaymentController.getStripe();
      expect(stripe).to.be.an('object');
      done();
    });
  });
  describe('Tests After Payment', () => {
    it('Should not allow non-authenticated user pay', (done) => {
      chai.request(app)
        .post('/api/pay/how-to-train-your-dragon-cjkjul5200000govbk1904')
        .send(paymentData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should not allow user pay if token is invalid', (done) => {
      chai.request(app)
        .post('/api/pay/how-to-train-your-dragon-cjkjul5200000govbk1904')
        .set('authorization', `Bearer ${validToken}sdfd123231`)
        .send(paymentData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should not allow user pay if token does not exist', (done) => {
      chai.request(app)
        .post('/api/pay/how-to-train-your-dragon-cjkjul5200000govbk1904')
        .send(paymentData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('Should not allow user pay if article does not exist', (done) => {
      chai.request(app)
        .post('/api/pay/how-to-train-your-dragon-cjkjul5200000govbk')
        .set('authorization', `Bearer ${validToken}`)
        .send(paymentData)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it('Should return article if user has bought it', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904')
        .set('authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('Should not allow user pay if article has been bought by user already', (done) => {
      chai.request(app)
        .post('/api/pay/how-to-train-your-dragon-cjkjul5200000govbk1904')
        .set('authorization', `Bearer ${validToken}`)
        .send(paymentData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it('Should return 200 for successful payment data insertion', (done) => {
      chai.request(app)
        .post('/api/pay/how-to-train-your-dragon-cjkjul5200000govbk1904/success')
        .set('authorization', `Bearer ${validToken}`)
        .send(paymentData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('Should not allow a user view an article if its not bought', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-dragon-cjkjul5200000govbk1904space/')
        .set('authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.body[0]).to.equal('You need to purchase this article to read it');
          done();
        });
    });
  });
});
