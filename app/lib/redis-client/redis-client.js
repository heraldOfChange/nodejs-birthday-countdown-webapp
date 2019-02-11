'use strict';

class RedisDatastoreClient {
  constructor(datastore, util) {
    this.datastore = datastore;
    this.util = util;
  }

  dbConnect(redisPort, redisHostname, credentials) {
    return new Promise((resolve, reject) => {
      // override the on_error to prevent crashing
      this.datastore.RedisClient.prototype.on_error = (err) => {
        reject(new Error(err));
      };

      let dbClient = this.datastore.createClient(redisPort, redisHostname, { auth_pass: credentials });
      let asyncFxns = this.createAsyncs(dbClient);

      dbClient.on('connect', function () {
        resolve(asyncFxns);
      });
    });
  }

  createAsyncs(dbClient) {
    return {
      setAsync: this.util.promisify(dbClient.set).bind(dbClient),
      getAsync: this.util.promisify(dbClient.get).bind(dbClient)
    };
  }
}

exports = module.exports = (datastore, util) => {
  return {
    promisedDatastore: () => new RedisDatastoreClient(datastore, util)
  };
};

exports['@singleton'] = true;
exports['@require'] = [ 'redis', 'util' ];