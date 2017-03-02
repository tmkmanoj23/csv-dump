'use strict'
const path = require('path')
, fs=require('fs')
, Converter = require('csvtojson').Converter
, async = require('async')
, config = require(__dirname + '/config')
, db = require(__dirname + '/config/db.js')
, Q = require('q')


function csvtojson (file,cb) {
  var converter = new Converter({})
  require("fs").createReadStream(file).pipe(converter)
  converter.on("end_parsed", function (jsonArray) {
    cb(jsonArray)
  })
}

function parsePath (path) {
    var parts = (/(\w?\:?\/?[\w\-_ \/]*\/+)?([\w-_ ]+)?(\.[\w-_ ]+)?/gi).exec(path)
    return {
        path: parts[0] || "",
        folder: parts[1] || "",
        name: parts[2] || "",
        extension: parts[3] || "",
    }
}

function fromDir(startPath,filter) {

  var results = []
    if (!fs.existsSync(startPath)) {
        console.log("no dir ",startPath)
        return
    }

    var files=fs.readdirSync(startPath)
    for(var i=0;i<files.length;i++) {

        var filename=path.join(startPath,files[i])
        var stat = fs.lstatSync(filename)

        if (stat.isDirectory()) {
            fromDir(filename,filter) //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            results.push(filename)
        }
    }
    return results
}

function dbInsert(object, options) {
  var q  = Q.defer()
  const db = options.db
  , collectionName = options.collectionName
    db.collection(collectionName).insertMany(object,function(err,doc){
      if(err){
        q.reject(err)
        
      }else{
        console.log("inserted == " + collectionName)
        q.resolve(true)
      }
         
    })
  return q.promise
}




function getCSVDetails(dirAddr) {
  var result = fromDir(dirAddr,'.csv')
  var jsonFiledata = []
  for(let i of result)
    jsonFiledata.push(parsePath(i))
  return jsonFiledata
}

function populateDb(filePath) {
  var csvDetails = getCSVDetails(filePath)
  db.init(function(err) {
    const dbConn =  db.client
    async.each(csvDetails, function(csvDetail, cb) {
      var options = {
        db: dbConn,
        collectionName: csvDetail.name
      }
      console.log(options.collectionName)
      csvtojson(csvDetail.path, function(data) {
        dbInsert(data, options).then(function(result){
          console.log(result)
        })
      })

      cb()
    },function(err){
      if(err){
        console.log('async error'+err)
      }

    })
    if(err)
    console.log(err)
  })

}
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val)
})
if(process.argv[2]===undefined) {
  console.log("no CSV File path given")
  return
}
else {
  var pathtoCSV  = process.argv[2]
  populateDb(pathtoCSV)
}
