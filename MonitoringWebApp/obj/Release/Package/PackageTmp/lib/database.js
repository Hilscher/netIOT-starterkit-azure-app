/**
 * Module dependencies.
 */
var config = require('../lib/config');
var documentDb = require("documentdb");
var documentClient = documentDb.DocumentClient;

/**
 * Module config.
 */
var client = new documentClient(config.documentDb.endpoint, { "masterKey": config.documentDb.masterKey });
var databaseUrl = 'dbs/' + config.documentDb.database.id;
var collectionUrl = databaseUrl + '/colls/' + config.documentDb.collection.id;

/**
 * Module functions.
 */
function getDatabase() {
  console.log('Getting database:' + config.documentDb.database.id);
  
  return new Promise(function (resolve, reject) {
    client.readDatabase(databaseUrl, function (error, result) {
      if (error) {
        if (error.code == config.httpStatusCodes.NOTFOUND) {
          client.createDatabase(config.documentDb.database, function (err, created) {
            if (error) reject(err)
            else resolve(created);
          });
        }
        else {
          reject(error);
        }
      }
      else {
        resolve(result);
      }
    });
  });
};

function getCollection() {
  console.log('Getting collection');
  
  return new Promise(function (resolve, reject) {
    client.readCollection(collectionUrl, function (err, result) {
      if (err) {
        if (err.code == config.httpStatusCodes.NOTFOUND) {
          client.createCollection(databaseUrl, config.documentDb.collection, { offerThroughput: 400 }, function (err, created) {
            if (err) reject(err)
            else resolve(created);
          });
        } else {
          reject(err);
        }
      } else {
        resolve(result);
      }
    });
  });
};

function getOrCreateDocument(document) {
  var documentUrl = collectionUrl + '/docs/' + document.id;
  console.log('Getting document: ' + document.id);
  
  return new Promise(function (resolve, reject) {
    client.readDocument(documentUrl, { partitionKey: document.district }, function (err, result) {
      if (err) {
        if (err.code == config.httpStatusCodes.NOTFOUND) {
          client.createDocument(collectionUrl, document, function (err, created) {
            if (err) reject(err)
            else resolve(created);
          });
        } else {
          reject(err);
        }
      } else {
        resolve(result);
      }
    });
  });
};

function queryCollection(query) {
  console.log('Querying collection through index:' + config.documentDb.collection.id);
  
  return new Promise(function (resolve, reject) {
    client.queryDocuments(
      collectionUrl,
      query
    ).toArray(function (err, results) {
      if (err) reject(err)
      else {
        var resultString = JSON.stringify(results);
        console.log('Query returned: ' + resultString);
        resolve(results);
      }
    });
  });
};

/**
 * Module exports.
 */
module.exports = {
  getDatabase: getDatabase,
  getCollection: getCollection,
  getOrCreateDocument: getOrCreateDocument,
  queryCollection: queryCollection
};