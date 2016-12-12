module.exports = {
  httpStatusCodes: {
    NOTFOUND: 404
  },
  iotHub: {
    connectionString: 'HostName=starterKitHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=9EzNGCfnqa/HceVUZofMkiSVafDbAwKBHBR8wKQwZVo='
  },
  documentDb: {
    endpoint: 'https://starterkitdb.documents.azure.com:443/',
    masterKey: 'OsB1lD98rRHyPWthgYqfmAjpeaheTGwjIwlornFMaovWgoZXA3H4W4Yg8BRS6gtgWletRG8W810BmLXhVd9aoA==',
    database: {
      id: 'StarterkitDB'
    },
    collection: {
      id: 'MainCollection'
    }
  }
};