
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import utilities from '../../helpers/utilities';


const { expect } = chai;
chai.use(chaiHttp);


let tokenId = '';

describe('Creating tokens', () => {
  const user = {
    email: 'agada@test.com',
    username: 'Awesome',
  };
  const expiringIn = 3600;

  it('It should create a token and return it', (done) => {
    tokenId = utilities.signToken({ user }, expiringIn);
    expect(tokenId).to.be.a('string');
    done();
  });
});


describe('POST /api/users/login/response', () => {
  it('should it should return a user', (done) => {
    chai.request(app)
      .post('/api/users/login/auth/response')
      .send({
        email: 'oki@gmail.com',
        firstname: 'maureen',
        lastname: 'oki',
        username: 'oki',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.nested.property('user.token');
        expect(res.body).to.have.nested.property('user.email');
        expect(res.body).to.have.nested.property('user.firstname');
        expect(res.body).to.have.nested.property('user.lastname');
        expect(res.body).to.have.nested.property('user.username');
        done();
      });
  });
});
