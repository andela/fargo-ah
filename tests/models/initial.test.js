import chai from 'chai';
import chaiHttp from 'chai-http';
// import server from '../../app';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Entry point', () => {
  describe('Navigating to a non-existing route', () => {
    it('Should return error 404', (done) => {
      chai.request(app)
        .get('/api/bad-route')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });
});
