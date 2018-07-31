import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';

chai.use(chaiHttp);
let authToken;
describe('Tests for user registration and log in', () => {
  const payload = {
    user: {
      username: 'jake',
      email: 'sinmiloluwasunday@yahoo.com',
      password: 'jakejake',
    }
  };
  it('Should be able to register a user and return a JWT token', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(payload)
      .end((err, res) => {
        authToken = res.body.user.token;
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.user).to.be.an('object');
        expect(res.body.user.token).to.not.equal(null);
        done();
      });
  });

  it(`Return a 409 conflict on register when
  the email or username already exists`, (done) => {
    chai.request(app)
      .post('/api/users')
      .send(payload)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(409);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(false);
        expect(res.body.errors.body).to.be.an('array');
        expect(res.body.errors.body[0])
          .to.equal('Username or email already exists');
        done();
      });
  });

  it(`Should be able to login a
  user and return a JWT token`, (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send(payload)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.user).to.be.an('object');
        expect(res.body.user.token).to.not.equal(null);
        done();
      });
  });

  it('Should not login with incorrect password', (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: {
          email: 'sinmiloluwasunday@yahoo.com',
          password: 'jakejake1',
        }
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(false);
        expect(res.body.errors.body).to.be.an('array');
        expect(res.body.errors.body[0])
          .to.equal('Authentication failed');
        done();
      });
  });

  it('Should not login with incorrect email', (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: {
          email: 'jake@jake1.jake',
          password: 'jakejake',
        }
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(false);
        expect(res.body.errors.body).to.be.an('array');
        expect(res.body.errors.body[0])
          .to.equal('Authentication failed');
        done();
      });
  });
});
describe('Test for password reset', () => {
  it('It should send email', (done) => {
    chai.request(app)
      .post('/api/users/password/reset')
      .send({
        user: {
          email: 'sinmiloluwasunday@yahoo.com',
        }
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Email sent successfully');
        done();
      });
  });
  it('It should reset password', (done) => {
    chai.request(app)
      .put('/api/users/password/reset/edit')
      .set('authorization', `Bearer ${authToken}`)
      .send({
        user: {
          password: 'tester',
        }
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Password reset successful!');
        done();
      });
  });
});
