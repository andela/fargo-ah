import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';


chai.use(chaiHttp);

describe('Test for user controllers', () => {
  it('True should be equal to true', (done) => {
    assert.equal('true', 'true');
    done();
  });
});

chai.should();
describe('User input validations test api/users', () => {
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

  it('should not create a new user if password is not up to 8 characters', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'jake2886',
          email: 'jake@jake2886.jak',
          password: '123456'
        }
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error.body[0].passwordError)
          .to.equal('Password must not be less than 8 characters');
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

  it('should not create a new user if password field is empty', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'jake2886',
          email: 'jake@jake2886.jak',
          password: ''
        }
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error.body[0].passwordError)
          .to.equal('Password cannot be empty');
        done();
      });
  });

  it('should not create a new user if username is not up to 5 characters', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'abj',
          email: 'jake@jake2886.jak',
          password: 'abc1234567'
        }
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error.body[0].usernameError)
          .to.equal('username must not be less than 5 characters');
        done();
      });
  });

  it('should not create a new user if email field is empty', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        user: {
          username: 'abj',
          email: '',
          password: 'abc1234567'
        }
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error.body[0].emailError)
          .to.equal('Email cannot be empty');
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
          email: 'jake@jake.jake',
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

describe('Test for authenticated user routes', () => {
  it('Should return the logged in user', (done) => {
    chai.request(app)
      .get('/api/user')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.user).to.be.an('object');
        done();
      });
  });

  it('Should return a status code of 200 on successful editing', (done) => {
    chai.request(app)
      .put('/api/user')
      .send({
        user: {
          username: 'jakehans',
          email: 'jake@jakehans.jake',
          bio: 'Humans of andela',
          image: 'https://i.stack.imgur.com/xHWG8.jpg'
        }
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});
