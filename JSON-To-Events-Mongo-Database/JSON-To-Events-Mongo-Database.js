/* CONNECT TO DATABASE PART */
// import the mongodb native drivers
var mongodbModule = require('mongodb');
// use the 'MongoClient' interface to connect to a mongodb
var MongoClient = mongodbModule.MongoClient;
// the url where your mongodb is running
var url = 'mongodb://localhost:27017/Events-Mongo-Database';


/* READ JSON OBJECT PART */
// import fileSystemModule
var fileSystemModule = require('fs');
// read file stream
var fileStream = fileSystemModule.readFileSync("../Crawler-Result-JSON-Tagged/Crawler-Result-Tagged.json");
// parse to JSON object
var eventsJsonObject = JSON.parse(fileStream);


/* CONNECT AND SAVE TO DATABASE PART */
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);

        // Get the Events Collection
        var eventsCollection = db.collection('EventsCollection');

        var removeAllData = function(callback) {
            // remove add the data from db
            eventsCollection.remove({}, function(err, result) {
                if (err) {
                    console.log(err);
                }
                console.log(result);
                db.close();
            });
            callback();
        };

        var insertJsonObject = function(callback) {
            // Insert The Events JSON Data into db
            eventsCollection.insert(eventsJsonObject, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted');
                }
                //Close connection
                db.close();
            });
            callback();
        };

        var showDbData = function() {
            // show the database data
            var eventsCollectionResult = eventsCollection.find({}).limit(0);

            eventsCollectionResult.toArray(function(err, result) {
                if (err) {
                    console.log('Find Err : ' + err);
                    //Close connection
                    db.close();
                } else {
                    console.log(JSON.stringify(result, null, 2));
                    console.log('The Collection Has ' + result.length + ' Items !');
                    //Close connection
                    db.close();
                }
            });
        }

        removeAllData(function() {
            insertJsonObject(function() {
                showDbData();
            })
        });

    }
});
