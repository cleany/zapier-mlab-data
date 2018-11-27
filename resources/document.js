const _sharedBaseUrl = 'https://auth-json-server.zapier.ninja';

const getDocument = (z, bundle) => {
  return z.request({
      url: `${_sharedBaseUrl}/recipes/${bundle.inputData.id}`
    })
    .then((response) => JSON.parse(response.content));
};

const listDocuments = (z, bundle) => {
  return z.request({
      url: _sharedBaseUrl + '/recipes',
      params: {
        style: bundle.inputData.style
      }
    })
    .then((response) => JSON.parse(response.content));
};

const createDocument = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/recipes',
    method: 'POST',
    body: JSON.stringify({
      name: bundle.inputData.name,
      directions: bundle.inputData.directions,
      authorId: bundle.inputData.authorId,
    }),
    headers: {
      'content-type': 'application/json'
    }
  };

  return z.request(requestOptions)
    .then((response) => JSON.parse(response.content));
};

const searchDocument = (z, bundle) => {
  return z.request({
      url: _sharedBaseUrl + '/recipes',
      params: {
        nameSearch: bundle.inputData.name
      }
    })
    .then((response) => {
      const matchingDocuments = JSON.parse(response.content);

      // Only return the first matching document
      if (matchingDocuments && matchingDocuments.length) {
        return [matchingDocuments[0]];
      }

      return [];
    });
};

const sample = {
  id: 1,
  createdAt: 1472069465,
  name: 'Best Spagetti Ever',
  authorId: 1,
  directions: '1. Boil Noodles\n2.Serve with sauce',
  style: 'italian',
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
        {key: 'id', required: true},
      ],
      perform: getDocument,
      sample: sample
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
        {key: 'style', type: 'string', helpText: 'Explain what style of cuisine this is.'},
      ],
      perform: listDocuments,
      sample: sample
    },
  },
  // If your app supports webhooks, you can define a hook method instead of a list method.
  // Zapier will turn this into a webhook Trigger on the app.
  // hook: {
  //
  // },

  // The create method on this resource becomes a Write on this app
  create: {
    display: {
      label: 'Create Document',
      description: 'Creates a new document.',
    },
    operation: {
      inputFields: [
        {key: 'name', required: true, type: 'string'},
        {key: 'directions', required: true, type: 'text', helpText: 'Explain how should one make the document, step by step.'},
        {key: 'authorId', required: true, type: 'integer', label: 'Author ID'},
        {key: 'style', required: false, type: 'string', helpText: 'Explain what style of cuisine this is.'},
      ],
      perform: createDocument,
      sample: sample
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
        {key: 'name', required: true, type: 'string'},
      ],
      perform: searchDocument,
      sample: sample
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obviously dummy values that we can show to any user.
  sample: sample,

  // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
  // field definitions. The result will be used to augment the sample.
  // outputFields: () => { return []; }
  // Alternatively, a static field definition should be provided, to specify labels for the fields
  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'createdAt', label: 'Created At'},
    {key: 'name', label: 'Name'},
    {key: 'directions', label: 'Directions'},
    {key: 'authorId', label: 'Author ID'},
    {key: 'style', label: 'Style'},
  ]
};