var outputFrontEndJSON;

module.exports.outputJSON = outputFrontEndJSON;

// ============================================================ (=x60)

var keyword = '';
var host = '';
var type = ['工作', '前端'];
if (type == "") {
    // console.log('不限類別');
    type = ['前端', '後端', 'Conf', '校園&社團', '軟體', '程式語言', 'app', '工作', '遊戲', '數據分析&AI', '資安', '開發', '作業系統', '硬體', '社群', '網路', '影像處理'];
} else {
    // console.log('限類別');
}
// 要等到轉成Num
var fee = {
    'lower': '',
    'upper': ''
};
// 要等到轉成Num
var number_of_people = {
    'lower': '',
    'upper': ''
};
// date暫時不搜尋
var date = {
    'start': '',
    'end': ''
};
// 要等作分類之後再搜尋，暫時不搜
var location = ['北', '中'];

// ============================================================ (=x60)

var mongodbModule = require('mongodb');
var MongoClient = mongodbModule.MongoClient;
var url = 'mongodb://localhost:27017/Events-Mongo-Database';

var queryAtDatabase = function(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Error Connecting to Datebase : ' + err);
        } else {
            console.log('Success Connected at : ' + url);
        }

        var eventsCollection = db.collection('EventsCollection');

        var querySyntaxObject = {
            $and: [{
                $or: [{
                        'title': {
                            '$regex': '.*' + keyword + '.*',
                            '$options': 'i'
                        }
                    },

                    {
                        'description': {
                            '$regex': '.*' + keyword + '.*',
                            '$options': 'i'
                        }
                    }
                ]
            }, {
                'host': {
                    '$regex': '.*' + host + '.*',
                    '$options': 'i'
                }
            }, {
                'type': {
                    $in: type
                }
            }]
        };

        console.log('query text is ' + querySyntaxObject['title']);

        eventsCollection.find(querySyntaxObject).limit(100).toArray(function(err, result) {
            //console.log(JSON.stringify(result, null, 2));
            console.log('Search Found ' + result.length + ' Items !');
            outputFrontEndJSON = result;
            callback();
        });

        //Close connection
        db.close();

    });
}

// ============================================================ (=x60)

var showOutputFrontEndJSON = function(callback) {
    for (var i = 0; i < outputFrontEndJSON.length; i++) {
        delete outputFrontEndJSON[i]['_id'];
        outputFrontEndJSON[i]['fee'] = parseInt(outputFrontEndJSON[i]['fee']);
        outputFrontEndJSON[i]['number_of_people'] = parseInt(outputFrontEndJSON[i]['number_of_people']);
    }
    //console.log('要輸出到前端的JSON為' + JSON.stringify(outputFrontEndJSON, null, 2));
    callback();
}

// ============================================================ (=x60)

module.exports.searchMongodb = function(inputRequestObject, callback) {
    keyword = inputRequestObject.keyword;
    host = inputRequestObject.host;
    type = inputRequestObject.type;
    if (type == "") {
        console.log('Request不限類別');
        type = ['前端', '後端', 'Conf', '校園&社團', '軟體', '程式語言', 'app', '工作', '遊戲', '數據分析&AI', '資安', '開發', '作業系統', '硬體', '社群', '網路', '影像處理'];
    } else {
        console.log('Request限類別');
    }
    queryAtDatabase(function() {
        showOutputFrontEndJSON(function() {
            module.exports.outputJSON = outputFrontEndJSON;
            console.log('Set inputObject to ' + module.exports.outputJSON);

            callback();
        })
    });
}
