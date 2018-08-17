import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

chai.use(chaiHttp);

let validToken;

describe('Tests for user controller', () => {
  describe('User input validations test api/users', () => {
    const data = {
      user: {
        username: '',
        email: 'email@emailcom',
        password: '12345678'
      }
    };
    it('should not create a new user if email format is not valid', (done) => {
      chai
        .request(app)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.error.body[0].emailError).to.equal('Invalid email format');
          done();
        });
    });

    it('should not create a new user if username field is empty', (done) => {
      chai
        .request(app)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.error.body[1].usernameError).to.equal('username cannot be empty');
          done();
        });
    });

    it('should not create a new user if password is not up to 8 characters', (done) => {
      chai
        .request(app)
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

    it('should not create a new user if email format is not valid', (done) => {
      chai
        .request(app)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.error.body[0].emailError).to.equal('Invalid email format');
          done();
        });
    });

    it('should not create a new user if username field is empty', (done) => {
      chai
        .request(app)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.error.body[1].usernameError).to.equal('username cannot be empty');
          done();
        });
    });

    it('should not create a new user if password is not alphanumeric', (done) => {
      chai
        .request(app)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.error.body[2].passwordError).to.equal('password must be alphanumeric');
          done();
        });
    });
  });
  describe('Tests for user registration and log in', () => {
    const payload2 = {
      user: {
        email: 'newuser@register.com',
        password: 'password123'
      }
    };

    it('Should be able to register a user and return a JWT token', (done) => {
      chai
        .request(app)
        .post('/api/users')
        .send({
          user: {
            username: 'newuserbyme',
            email: 'newuserbyme@register.com',
            password: 'password123'
          }
        })
        .end((err, res) => {
          validToken = res.body.user.token;
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.user).to.be.an('object');
          expect(res.body.user.token).to.not.equal(null);
          done();
        });
    });

    it('Should update profile if all required fields are entered', (done) => {
      chai
        .request(app)
        .put('/api/profiles/newuserbyme')
        .send({
          user: {
            username: 'Jacob',
            lastname: 'knight',
            firstname: 'peter',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
      done();
    });

    it('Return a 409 conflict on register when the email or username already exists', (done) => {
      chai
        .request(app)
        .post('/api/users')
        .send({
          user: {
            username: 'newuserbyme',
            email: 'newuserbyme@register.com',
            password: 'password123'
          }
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(409);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body).to.be.an('array');
          expect(res.body.errors.body[0]).to.equal('Username or email already exists');
          done();
        });
    });

    it('Should be able to login a user and return a JWT token', (done) => {
      chai
        .request(app)
        .post('/api/users/login')
        .send(payload2)
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

    it('should not create a new user if password field is empty', (done) => {
      chai
        .request(app)
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
          expect(res.body.error.body[0].passwordError).to.equal('Password cannot be empty');
          done();
        });
    });

    it('should not create a new user if username is not up to 5 characters', (done) => {
      chai
        .request(app)
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
    it('Should not login with incorrect email', (done) => {
      chai
        .request(app)
        .post('/api/users/login')
        .send({
          user: {
            email: 'jake@jake1.jake',
            password: 'jakejake'
          }
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body).to.be.an('array');
          expect(res.body.errors.body[0]).to.equal('Authentication failed');
          done();
        });
    });

    it('Should not login with incorrect password', (done) => {
      chai
        .request(app)
        .post('/api/users/login')
        .send({
          user: {
            email: 'newuser@jake.jak',
            password: 'jakejake123'
          }
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body).to.be.an('array');
          expect(res.body.errors.body[0]).to.equal('Authentication failed');
          done();
        });
    });

    it('Should not login in unverified user incorrect email', (done) => {
      chai
        .request(app)
        .post('/api/users/login')
        .send({
          user: {
            email: 'newusertwo@register.com',
            password: 'password123'
          }
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body).to.be.an('array');
          expect(res.body.errors.body[0])
            .to.equal('Your account has not been activated');
          done();
        });
    });

    it('Registered user should be unable to login if unverified', (done) => {
      chai
        .request(app)
        .post('/api/users/login')
        .send(payload2)
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
  });
  describe('Resend Verification', () => {
    const verifiedUser = {
      user: {
        email: 'newuser@register.com'
      }
    };
    const unVerifiedUser = {
      user: {
        email: 'newusertwo@register.com'
      }
    };
    const unregUser = {
      user: {
        email: 'unreg@unregister.com'
      }
    };
    it('Should not resend verification email to an already verified', (done) => {
      chai
        .request(app)
        .post('/api/users/reverify')
        .send(verifiedUser)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.body[0]).to.equal('Your account has already been verified');
          done();
        });
    });

    it('Should not resend verification email to an unregistered user', (done) => {
      chai
        .request(app)
        .post('/api/users/reverify')
        .send(unregUser)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.body[0])
            .to.equal('You have entered an unregistered email address');
          done();
        });
    });
    it('Should send verification email to an unverified user', (done) => {
      chai
        .request(app)
        .post('/api/users/reverify')
        .send(unVerifiedUser)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message.body[0]).to.equal('A verification email has been sent to you');
          done();
        });
    });
    it('Should not verify an invalid user or token', (done) => {
      chai
        .request(app)
        .get('/api/users/verify/sdjhhsakjhasdsdsdasddadaasdsad')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.body[0]).to.equal('Your verification link has expired or invalid');
          done();
        });
    });
    it('should not create a new user if email field is empty', (done) => {
      chai
        .request(app)
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
          expect(res.body.error.body[0].emailError).to.equal('Email cannot be empty');
          done();
        });
    });
  });
  describe('Tests for user profile', () => {
    it('Should return profile for a username that exists', (done) => {
      chai
        .request(app)
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
      chai
        .request(app)
        .get('/api/profiles/1234567890')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('The user does not exist');
        });
      done();
    });
    it('Should update profile if all required fields are entered', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'Jacob',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
      done();
    });
    it('Should not update profile if the username is incorrect', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl4r')
        .send({
          user: {
            username: 'Jacob',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('The user does not exist');
        });
      done();
    });
    it('Should not update profile if no token is supplied', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'Jacob',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(401);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('No token has been provided in the request');
        });
      done();
    });
    it('Should not update profile if token supplied is invalid', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'Jacob',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(401);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('Could not authenticate the provided token');
        });
      done();
    });
    it('Should not edit profile if username is less than 5 characters', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'asdf',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0]).to.equal('Username can not be less than 5 characters');
        });
      done();
    });
    it('Should not edit profile if username contains special characters', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: ';solgs@',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0]).to.equal('Username can not contain special characters');
        });
      done();
    });
    it('Should not edit profile if image is not a valid url', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: ';solgs@',
            bio:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            image: 'anewimage'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0]).to.equal('Username can not contain special characters');
        });
      done();
    });
    it('Should not edit profile if bio contains less than 10 characters', (done) => {
      chai
        .request(app)
        .put('/api/profiles/asdfghjkl')
        .send({
          user: {
            username: 'asdfghjkl',
            bio: 'Lorem Ipsum is',
            image:
              'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15977554_1582808678414512_6741269562835437124_n.jpg?_nc_cat=0&oh=8fee46fdcaa8b427c292156d60d11d62&oe=5BCD4054'
          }
        })
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.error[0]).to.equal('Bio can not be less than 100 characters');
        });
      done();
    });

    it('Should not login in a user with wrong password', (done) => {
      const verifiedUser = {
        user: {
          email: 'newuser@register.com',
          password: 'password1234'
        }
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(verifiedUser)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.errors.body[0]).to.equal('Authentication failed');
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.body[0]).to.equal('Authentication failed');
          done();
        });
    });
  });
  describe('Tests for user follow/unfollow feature', () => {
    const payload = {
      user: {
        email: 'newuser@register.com',
        password: 'password123'
      }
    };
    let userToken = null;
    beforeEach((done) => {
      chai
        .request(app)
        .post('/api/users/login')
        .send(payload)
        .end((err, res) => {
          userToken = `Bearer ${res.body.user.token}`;
          done();
        });
    });

    it('Should be able to follow an author', (done) => {
      chai
        .request(app)
        .post('/api/profiles/JakeJone/follow')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.user).to.be.an('object');
        });
      done();
    });

    it('Should not be able to follow an author twice', (done) => {
      chai
        .request(app)
        .post('/api/profiles/JakeJone/follow')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(409);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('Already following');
        });
      done();
    });

    it('Should not be able to follow himself', (done) => {
      chai
        .request(app)
        .post('/api/profiles/regnewuser/follow')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(409);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('You cannot follow yourself');
        });
      done();
    });

    it('Should return an array of IDs of authors am following', (done) => {
      chai
        .request(app)
        .get('/api/profiles/following/view')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.user.amFollowing).to.be.an('array');
        });
      done();
    });

    it('Should return an array of users followers', (done) => {
      chai
        .request(app)
        .get('/api/profiles/follower/view')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
      done();
    });

    it('Should be able to unfollow an author', (done) => {
      chai
        .request(app)
        .delete('/api/profiles/JakeJone/follow')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
      done();
    });

    it('Should not be able to unfollow an author twice', (done) => {
      chai
        .request(app)
        .delete('/api/profiles/JakeJone/follow')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('You are no longer following this author');
        });
      done();
    });

    it('Should return error if the user does not exist', (done) => {
      chai
        .request(app)
        .delete('/api/profiles/JakeJoneOkpara/follow')
        .set({ Authorization: userToken })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors.body[0]).to.equal('The user does not exist');
        });
      done();
    });

    it('Should return error if the token is invalid', (done) => {
      chai
        .request(app)
        .delete('/api/profiles/JakeJoneOkpara/follow')
        .set('authorization', `Bearer ${validToken}asdfg`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(401);
          expect(res.body.errors.body[0]).to.equal('Could not authenticate the provided token');
        });
      done();
    });
  });
  describe('Test for password reset', () => {
    it('It should send email', (done) => {
      chai
        .request(app)
        .post('/api/users/password/reset')
        .send({
          user: { email: 'newuser@register.com' }
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'Email sent successfully');
          done();
        });
    });
    it('It should reset password', (done) => {
      chai
        .request(app)
        .put('/api/users/password/reset/edit')
        .set('authorization', `Bearer ${validToken}`)
        .send({
          user: {
            password: 'tester123'
          }
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'Password reset successful!');
          done();
        });
    });

    it('Should be able to verify a new user', (done) => {
      const token = jwt.sign({ id: 9 },
        process.env.SECRET_KEY, { expiresIn: 60 * process.env.VERIFYTOKEN_EXPIRY });
      chai
        .request(app)
        .get(`/api/users/verify/${token}`)
        .send({
          user: {
            username: 'kaizer',
            email: 'chief@kf.com',
            password: 'password123'
          }
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('The user has been verified');
          done();
        });
    });

    it('It should not reset password if token cannot be found', (done) => {
      chai
        .request(app)
        .put('/api/users/password/reset/edit')
        .set('authorization', '')
        .send({
          user: {
            password: 'tester123'
          }
        })
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body.errors.body[0], 'No token has been provided in the request');
          done();
        });
    });
  });
});
