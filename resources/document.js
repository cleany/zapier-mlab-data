const getBaseUrl = (bundle) => {
  const sharedBaseUrl = 'https://api.mlab.com/api/1';

  return `${sharedBaseUrl}/databases/${bundle.authData.dbName}/collections/${
    bundle.inputData.collection
  }`;
};

const addId = (doc) => {
  return Object.assign({ id: doc._id['$oid'] }, doc);
};

const getDocument = async (z, bundle) => {
  const response = await z.request({
    url: `${getBaseUrl(bundle)}/${bundle.inputData.id}`,
  });

  if (response.status !== 200) {
    throw new Error(response.content);
  }

  return addId(z.JSON.parse(response.content));
};

const listDocuments = async (z, bundle) => {
  let query;

  if (bundle.inputData.query === undefined) {
    query = '{}';
  } else if (typeof bundle.inputData.query !== 'string') {
    query = z.JSON.stringify(bundle.inputData.query);
  } else if (bundle.inputData.query !== '') {
    query = bundle.inputData.query;
  }

  const response = await z.request({
    url: `${getBaseUrl(bundle)}?q=${query}`,
  });
  if (response.status !== 200) {
    throw new Error(response.content);
  }

  return z.JSON.parse(response.content).map(addId);
};

const createDocument = async (z, bundle) => {
  let data = bundle.inputData.data;

  if (typeof data === 'string') {
    data = z.JSON.parse(data);
  }

  if (data instanceof Array && data.length !== 1) {
    throw new z.errors.HaltedError('only a single item is allowed in create');
  }
  if (data instanceof Array) {
    data = data[0];
  }
  data = z.JSON.stringify(data);

  const response = await z.request({
    url: getBaseUrl(bundle),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  });

  if (![200, 201].includes(response.status)) {
    throw new Error(response.content);
  }

  return addId(z.JSON.parse(response.content));
};

const sample = {
  id: '5abd1f34ed2d1d01049e7be7',
  _id: {
    $oid: '5abd1f34ed2d1d01049e7be7',
  },
  account: {
    id: '0010Y00000SeRx0QAF',
    name: 'Notify',
    address: '41 rue de Prony, 75017 Paris',
  },
  owner: {
    id: '0030Y00000KBxKfQAL',
    name: 'Sébastien Boulle',
  },
  logType: 'visit',
  date: '2018-03-29T17:15:25Z',
  comment: 'Test visite 1',
  __v: 0,
  auto_tags: ['OTHER'],
};

// This file exports a Document resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'document',
  noun: 'Document',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Document',
      description: 'Gets a document.',
    },
    operation: {
      inputFields: [
        { key: 'collection', required: true },
        { key: 'id', required: true },
      ],
      perform: getDocument,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Document',
      description: 'Trigger when a new document is added.',
    },
    operation: {
      inputFields: [
        { key: 'collection', required: true },
        { key: 'query', required: true },
      ],
      perform: listDocuments,
      sample: sample,
    },
  },

  // The create method on this resource becomes a Write on this app
  create: {
    display: {
      label: 'Create or Update Document',
      description:
        'Creates a new document, or update it if _id already exists.',
    },
    operation: {
      inputFields: [
        { key: 'collection', required: true },
        { key: 'data', required: true },
      ],
      perform: createDocument,
      sample: sample,
    },
  },

  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Document',
      description: 'Finds an existing document by name.',
    },
    operation: {
      inputFields: [
        { key: 'collection', required: true },
        { key: 'query', required: true },
      ],
      perform: listDocuments,
      sample: sample,
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obviously dummy values that we can show to any user.
  sample: sample,

  outputFields: [],
};
