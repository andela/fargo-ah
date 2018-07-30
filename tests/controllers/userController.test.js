import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';


chai.use(chaiHttp);

const user = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTMzMDc3ODcyfQ.YibyD9L42qZB-mFpviFlVBFzXM9-dsnLLzh9Y48-63Y';
describe('Tests for user controller', () => {
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
            email: 'jake@jake.jak',
            password: 'jakejake123',
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
            email: 'jake@jake1.jak',
            password: 'jake12jake',
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
describe('Tests for user registration and log in', () => {
  const payload = {
    user: {
      username: 'jakejake',
      email: 'jake@jake.jak',
      password: 'jakejake12',
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

  describe('Tests for user profile', () => {
    it('Should return profile for a username that exists', (done) => {
      chai.request(app)
        .get('/api/profiles/asdfghjkl')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.user).to.be.an('object');
        });
      done();
    });
    it('Should not return profile for a username that does not exists', (done) => {
      chai.request(app)
        .get('/api/profiles/1234567890')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0])
            .to.equal('The user does not exist');
        });
      done();
    });
    it('Should update profile if all required fields are entered', (done) => {
      chai.request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'Jacob',
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
          }
        })
        .set('Authorization', user)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
      done();
    });
    it('Should not update profile if no token is supplied', (done) => {
      chai.request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'Jacob',
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
          }
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(401);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0])
            .to.equal('No token has been provided in the request');
        });
      done();
    });
    it('Should not update profile if token supplied is invalid', (done) => {
      chai.request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'Jacob',
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
          }
        })
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTMzMDc3ODcyfQ.YibyD9L42qZB-mFpviFlVBFzXM9-dsnLLzh9Y48-63Y')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(401);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0])
            .to.equal('Could not authenticate the provided token');
        });
      done();
    });
    it('Should not edit profile if username is less than 5 characters', (done) => {
      chai.request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'asdf',
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
          }
        })
        .set('Authorization', user)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0])
            .to.equal('Username can not be less than 5 characters');
        });
      done();
    });
    it('Should not edit profile if username contains special characters', (done) => {
      chai.request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: ';solgs@',
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
          }
        })
        .set('Authorization', user)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0])
            .to.equal('Username can not contain special characters');
        });
      done();
    });
    it('Should not edit profile if image is not a valid url', (done) => {
      chai.request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: ';solgs@',
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            image: 'anewimage',
          }
        })
        .set('Authorization', user)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0])
            .to.equal('Username can not contain special characters');
        });
      done();
    });
    it('Should not edit profile if bio contains special characters', (done) => {
      chai.request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'asdfghjkl',
            bio: 'Lorem Ipsum is',
            image: 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054',
          }
        })
        .set('Authorization', user)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0])
            .to.equal('Bio can not be less than 100 characters');
        });
      done();
    });
  });
});
