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

  it('should create a document', (done) => {
    const bundle = {
      authData,
      inputData: {
        collection: 'logs',
        data: JSON.stringify({
          account: {
            id: '0010Y00000OS6TnQAL',
            name: '4C Consulting',
            address: '35 Rue des Mathurins, 75008 Paris',
          },
          owner: { id: '0030Y00000KBxKfQAL', name: 'Sébastien Boulle' },
          logType: 'visit',
          date: { $date: '2018-03-28T20:11:52.000Z' },
          comment: 'test',
          __v: 0,
          auto_tags: ['Autre'],
        }),
      },
    };

    appTester(App.resources.document.create.operation.perform, bundle)
      .then((results) => {
        results.should.have.property('id');
        done();
      })
      .catch(done);
  });

  it('should create a document in array', (done) => {
    const bundle = {
      authData,
      inputData: {
        collection: 'logs',
        data: JSON.stringify([
          {
            account: {
              id: '0010Y00000OS6TnQAL',
              name: '4C Consulting',
              address: '35 Rue des Mathurins, 75008 Paris',
            },
            owner: { id: '0030Y00000KBxKfQAL', name: 'Sébastien Boulle' },
            logType: 'visit',
            date: { $date: '2018-03-28T20:11:52.000Z' },
            comment: 'test',
            __v: 0,
            auto_tags: ['Autre'],
          },
        ]),
      },
    };

    appTester(App.resources.document.create.operation.perform, bundle)
      .then((results) => {
        results.should.have.property('id');
        done();
      })
      .catch(done);
  });

  it('create more than one documents is not allowed', (done) => {
    const bundle = {
      authData,
      inputData: {
        collection: 'logs',
        data: JSON.stringify([
          {
            account: {
              id: '0010Y00000OS6TnQAL',
              name: '4C Consulting',
              address: '35 Rue des Mathurins, 75008 Paris',
            },
            owner: { id: '0030Y00000KBxKfQAL', name: 'Sébastien Boulle' },
            logType: 'visit',
            date: { $date: '2018-03-28T20:11:52.000Z' },
            comment: 'test',
            __v: 0,
            auto_tags: ['Autre'],
          },
          {
            account: {
              id: '0010Y00000OS6TnQAL',
              name: '4C Consulting',
              address: '35 Rue des Mathurins, 75008 Paris',
            },
            owner: { id: '0030Y00000KBxKfQAL', name: 'Sébastien Boulle' },
            logType: 'visit',
            date: { $date: '2018-03-28T20:11:52.000Z' },
            comment: 'test',
            __v: 0,
            auto_tags: ['Autre'],
          },
        ]),
      },
    };

    appTester(App.resources.document.create.operation.perform, bundle)
      .then((result) => {
        done('This should not happen');
      })
      .catch((err) => {
        const message = 'only a single item is allowed in create';
        err.message.includes(message).should.exactly(true);
        done();
      });
  });
});
