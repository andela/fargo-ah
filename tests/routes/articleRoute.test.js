import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);
describe('Test for article endpoints', () => {
  it('True should be equal to true', (done) => {
    assert.equal('true', 'true');
    done();
  });
});
