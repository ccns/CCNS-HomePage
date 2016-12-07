// ============================================================ (=x60)

var fileSystemModule = require('fs');
var serverConfigString = fileSystemModule.readFileSync("../Server-Config.json");
var serverConfigObject = JSON.parse(serverConfigString);
console.log('Server Config is \n' + serverConfigString);

var mainPage = '';
var FrontEndListenIP = '';
var FrontEndListenPort = '';
var AllowFrontEndOrigin = '';

if (serverConfigObject['Mode'] == 'Develop-Mode') {
    console.log('Mode is Develop-Mode...');

    mainPage = 'indexDevelop.html'
    FrontEndListenIP = serverConfigObject['Develop-Mode']["Front-End-Listen-IP"];
    FrontEndListenPort = serverConfigObject['Develop-Mode']["Front-End-Listen-Port"];
    AllowFrontEndOrigin = serverConfigObject['Develop-Mode']['Allow-Front-End-Origin']

} else {
    console.log('Mode is Deploy-Mode...');

    mainPage = 'indexDeploy.html'
    FrontEndListenIP = serverConfigObject['Deploy-Mode']["Front-End-Listen-IP"];
    FrontEndListenPort = serverConfigObject['Deploy-Mode']["Front-End-Listen-Port"];
    AllowFrontEndOrigin = serverConfigObject['Deploy-Mode']['Allow-Front-End-Origin']

}

// ============================================================ (=x60)

var searchModule = require('./search')

// ============================================================ (=x60)

var expressModule = require('express');
var app = expressModule();

app.use(expressModule.static('../Front-End-Page'));

app.get('/MeetPie', function(req, res) {
    res.sendFile(mainPage, {
        root: __dirname + '/../Front-End-Page/Page-MeetPie/'
    });
});

app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: __dirname + '/../Front-End-Page/Page-Home/'
    });
});

var server = app.listen(FrontEndListenPort, FrontEndListenIP, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

// ============================================================ (=x60)

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', AllowFrontEndOrigin);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// ============================================================ (=x60)

var searchModule = require('./search');

// ============================================================ (=x60)

var bodyParserModule = require('body-parser');
app.use(bodyParserModule.urlencoded({
    extended: true
}));
app.use(bodyParserModule.json());

// ============================================================ (=x60)

app.post("/", function(req, res) {

    // TODO 少了location

    if (req.body.location == undefined) {
        req.body.location = new Array();
    }

    if (req.body.type == undefined) {
        req.body.type = new Array();
    }

    console.log('Request Body is ' + JSON.stringify(req.body, null, 2));
    console.log('Request Keyword is ' + req.body.keyword);
    console.log('Request Host is ' + req.body.host);

    var requestObject = req.body;

    searchModule.searchMongodb(requestObject, function() {
        console.log('JsonToSend is ' + searchModule.outputJSON);
        res.setHeader('Content-Type', 'application/json');
        console.log('We Send ' + searchModule.outputJSON);
        res.send(JSON.stringify(searchModule.outputJSON));
        console.log('Send Post !');
    });

});;
