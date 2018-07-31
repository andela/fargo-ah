import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.should();
chai.use(chaiHttp);
describe('Test for user endpoints', () => {
  it('True should be equal to true', (done) => {
    assert.equal('true', 'true');
    done();
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
        assert.equal(res.body.message, 'not found');
        done();
      });
  });
});
