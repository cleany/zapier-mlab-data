require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('document resource', () => {
  it('should get an existing document', (done) => {
    const bundle = {
      inputData: {
        id: 1,
      },
    };

    appTester(App.resources.document.get.operation.perform, bundle)
      .then((results) => {
        results.name.should.eql('name 1');
        results.directions.should.eql('directions 1');
        done();
      })
      .catch(done);
  });

  it('should list existing documents', (done) => {
    const bundle = {
      inputData: {
        style: 'style 2',
      },
    };

    appTester(App.resources.document.list.operation.perform, bundle)
      .then((results) => {
        results.length.should.above(0);

        const firstDocument = results[0];
        firstDocument.name.should.eql('name 2');
        firstDocument.directions.should.eql('directions 2');
        done();
      })
      .catch(done);
  });

  it('should create a new document', (done) => {
    const bundle = {
      inputData: {
        name: 'Smith Family Document',
        directions: '1. Order out :)',
        authorId: 1,
      },
    };

    appTester(App.resources.document.create.operation.perform, bundle)
      .then((results) => {
        results.should.have.property('name');
        done();
      })
      .catch(done);
  });

  it('should find a document', (done) => {
    const bundle = {
      inputData: {
        name: 'Smith Family Document',
      },
    };

    appTester(App.resources.document.search.operation.perform, bundle)
      .then((results) => {
        results[0].should.have.property('name');
        done();
      })
      .catch(done);
  });
});
