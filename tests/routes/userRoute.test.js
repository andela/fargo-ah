import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
describe('Test for user endpoints', () => {
  it('should return 404 for an unknown route', (done) => {
    chai.request(app)
      .get('/api/us')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
describe('Test for sending email to reset password', () => {
  it('It should not send email if email address is non-existent', (done) => {
    chai.request(app)
      .post('/api/users/password/reset')
      .send({
        user: {
          email: 'suraj@yahoo.com',
        }
      })
      .end((err, res) => {
        assert.equal(res.status, 404);
        assert.equal(res.body.errors.body[0], 'email does not exist');
        done();
      });
  });
  it('It should not send email if email field id empty', (done) => {
    chai.request(app)
      .post('/api/users/password/reset')
      .send({
        user: {
          email: '',
        }
      })
      .end((err, res) => {
        assert.equal(res.status, 422);
        assert.equal(res.body.errors.body[0], 'Email cannot be empty');
        done();
      });
  });
  it('It should not send email if email address is not valid', (done) => {
    chai.request(app)
      .post('/api/users/password/reset')
      .send({
        user: {
          email: 'rubbish@nothing',
        }
      })
      .end((err, res) => {
        assert.equal(res.status, 422);
        assert.equal(res.body.errors.body[0], 'Invalid email format');
        done();
      });
  });
  it('Password field must not be empty', (done) => {
    chai.request(app)
      .put('/api/users/password/reset/edit')
      .send({
        user: {
          password: '',
        }
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.equal(res.body.errors.body[0], 'Password cannot be empty');
        done();
      });
  });
});
