import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';


chai.use(chaiHttp);

chai.should();

describe('Test for user controllers', () => {
  it('True should be equal to true', (done) => {
    assert.equal('true', 'true');
    done();
  });
});

chai.should();
describe('POST api/users', () => {
  const data = {
    user: {
      username: '',
      email: 'email@emailcom',
      password: '12345678',
    }
  };
  it('should not create a new user if email format is not valid', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error.body[0].emailError)
          .to.equal('Invalid email format');
        done();
      });
  });
  it('should not create a new user if username field is empty', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error.body[1].usernameError)
          .to.equal('username cannot be empty');
        done();
      });
  });

  it('should not create a new user if password is not alphanumeric', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error.body[2].passwordError)
          .to.equal('password must be alphanumeric');
        done();
      });
  });
});


describe('Tests for user registration and log in', () => {
  const payload = {
    user: {
      username: 'jakejake',
      email: 'jake@jake.jak',
      password: 'jake12jake',
    }
  };
  const seededUser = {
    user: {
      username: 'regnewuser',
      email: 'newuser@register.com',
      password: 'password123'
    }
  };
  it('Should be able to register a user and return a JWT token', (done) => {
    chai.request(app)
      .post('/api/users')
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
      .send(seededUser)
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
          email: 'makesense@jake.jake',
          password: 'jakejakesense',
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
          email: 'newuse@register.com',
          password: 'password123',
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

  it('Should not login in unverified user incorrect email', (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: {
          email: 'newusertwo@register.com',
          password: 'password123',
        }
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(false);
        expect(res.body.errors.body).to.be.an('array');
        expect(res.body.errors.body[0])
          .to.equal('You account has not been activated');
        done();
      });
  });


  describe('Tests for resending user verification email ', () => {
    const unRegisteredUser = {
      user: {
        email: 'newuserzzz@register.com',
      }
    };
    const seededData = {
      user: {
        email: 'newuser@register.com',
        password: 'password123',
      }
    };
    const seededData2 = {
      user: {
        email: 'newusertwo@register.com',
        password: 'password123',
      }
    };
    it('Should send a verification email to unverified users', (done) => {
      chai.request(app)
        .post('/api/users/recover')
        .send(seededData2)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.message.body[0])
            .to.equal('A verification email will be sent to you if your account is not yet verified');
          done();
        });
    });

    it('Should not send a verification email to verified users', (done) => {
      chai.request(app)
        .post('/api/users/recover')
        .send(seededData)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.body[0])
            .to.equal('A verification email will be sent to you if your account is not yet verified');
          done();
        });
    });


    it('Should not verify an Invalid verification token', (done) => {
      chai.request(app)
        .get('/api/users/verify/sandjklasdjsalsdkasdksdkjskda')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.body[0])
            .to.equal('Your verification link has expired or invalid');
          done();
        });
    });
  });
});
