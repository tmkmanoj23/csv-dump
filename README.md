# directory-to-mongo
searches for csv files in a directory, imports them to mongodb with collectionname as per their filenames

** to run

setup your database config in the config/env/development.js file
then goto terminal and run -

node updater.js <directorypath-to-csvfiles>

for example
node updater.js ./csv_files/
 
** to delete multiple collections from db run this in mongo shell

```
itemsToDelete = [
  'city_mapping',
  'country_mapping',
  'ctc_mapping',
  'dollars_mapping',
  'experience_mapping',
  'functional_roles_mapping',
  'pg_course_mapping',
  'ug_course_mapping',
  'industry_mapping'
]

db.getCollectionNames().forEach(function(collection){ 

  if(itemsToDelete.indexOf(collection)>=0){ 
    db[collection].drop()
    print('dropped'+collection)
  } 
})

```
