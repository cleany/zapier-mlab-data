require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('document resource', () => {
  zapier.tools.env.inject();
  const authData = {
    apiKey: process.env.MLAB_API_KEY,
    dbName: process.env.MLAB_DB_NAME,
  };

  it('should get an existing document', (done) => {
    const bundle = {
      authData,
      inputData: {
        collection: 'logs',
        id: '5b522bb96090170034c0c1ad',
      },
    };

    appTester(App.resources.document.get.operation.perform, bundle)
      .then((results) => {
        results.id.should.equal('5b522bb96090170034c0c1ad');
        done();
      })
      .catch(done);
  });

  it('should list existing documents', (done) => {
    const bundle = {
      authData,
      inputData: {
        collection: 'logs',
        query: JSON.stringify({ logType: 'interview' }),
      },
    };

    appTester(App.resources.document.list.operation.perform, bundle)
      .then((results) => {
        results.length.should.above(0);
        done();
      })
      .catch(done);
  });

  it('should find a document', (done) => {
    const bundle = {
      authData,
      inputData: {
        collection: 'logs',
        query: JSON.stringify({ logType: 'interview' }),
      },
    };

    appTester(App.resources.document.search.operation.perform, bundle)
      .then((results) => {
        results.length.should.above(0);
        done();
      })
      .catch(done);
  });
});
