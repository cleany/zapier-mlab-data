const sharedBaseUrl = 'https://api.mlab.com/api/1';

const addApiKey = (request, z, bundle) => {
  let operator = '?';

  if (request.url.includes('?')) {
    operator = '&';
  }

  request.url = `${request.url}${operator}apiKey=${bundle.authData.apiKey}`;
  return request;
};

const authentication = {
  type: 'custom',
  test: async (z, bundle) => {
    const response = await z.request({
      url: `${sharedBaseUrl}/databases/${bundle.authData.dbName}/collections`,
    });

    if (response.status === 401) {
      throw new Error('The API Key you supplied is invalid');
    }
    return response.json;
  },

  connectionLabel: (z, bundle) => {
    return bundle.authData.dbName;
  },

  fields: [
    {
      key: 'apiKey',
      type: 'string',
      required: true,
      helpText: 'The mLab data api key',
    },
    {
      key: 'dbName',
      type: 'string',
      required: true,
      helpText: 'The mongoDb database name',
    },
  ],
};

module.exports = {
  authentication,
  addApiKey,
};
