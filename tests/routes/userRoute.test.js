import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';

chai.should();
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
