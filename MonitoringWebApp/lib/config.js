/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

module.exports = {
  httpStatusCodes: {
    NOTFOUND: 404
  },
  iotHub: {
    connectionString: 'HostName=yourHostName.azure-devices.net;SharedAccessKeyName=yourAccessKeyName;SharedAccessKey=yourAccessKey'
  },
  documentDb: {
    endpoint: 'https://yourHostName.documents.azure.com:443/',
    masterKey: 'yourMasterKey',
    database: {
      id: 'yourDbId'
    },
    collection: {
      id: 'yourCollectionId'
    }
  }
};