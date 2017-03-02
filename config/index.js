'use strict';

const envFilePath = __dirname + "/env/development.js"
var environmentOptions, projectName

environmentOptions = require(envFilePath)

projectName = environmentOptions.projectName || "britannia"

module.exports = {
  databaseUrl: environmentOptions.database.path + environmentOptions.database.name,
  databaseHost: environmentOptions.database.host,
  databasePort: environmentOptions.database.port,
  databaseName: environmentOptions.database.name,
}
