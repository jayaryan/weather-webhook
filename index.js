var request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// webhook //

app.post('/webhook', function (req, res) {
    console.log("receive request information");

    if(!req.body) res.sendStatus(400);

    // res.set('Content-Type', 'application/json');
    console.log("Post request from DialogFlow");
//    console.log(req.body);
    console.log("Request Geo city is - ", req.body.queryResult.parameters['geo-city']);

    let city = req.body.queryResult.parameters['geo-city'];

    let weather = 'You are requesting for an invalid city';

    if(city)
        weather = getWeather(city);

    let response = 'Sorry, do not understand your query';
    let responseObject = {
        "fulfillmentText": response,
        "fulfillmentMessage": [{"text": {"text": [weather]}}],
        "source": ""
    };

    console.log("response to DialogFlow");
    console.log(responseObject);

    return res.json({ 'fulfillmentText': weather }); //trying with this , and this is working
    // return res.json(responseObject);

})

// to test with browser
app.get('/weather/:city', function (req, res) {
    console.log("receive request information");

    // if(!req.body) res.sendStatus(400);
    //
    // res.set('Content-Type', 'application/json');
    console.log("Get request from URL");
    console.log(req.params);
    console.log("Request Geo city is - ", req.params.city);

    let city = req.params.city;

    let weather = 'You are requesting for an invalid City';
    if(city)
        weather = getWeather(city);
    let response = '';
    let responseObject = {
        "fulfillmentText": response,
        "fulfillmentMessage": [{"text": {"text": [weather]}}],
        "source": ""
    };

    console.log("response to DialogFlow");
    console.log(responseObject);

    return res.json(responseObject);

})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3030, () => console.log('Example app listening on port 3030!'))

var result;
var apiKey = 'f6dacb03346d39ed9172cd49941688a3';

function callback(err, response, body) {

    if(err) console.log("Error - ", err);

    // console.log(body);
    let weather = JSON.parse(body);
    if(weather.message === 'city not found')
        result = 'Unable to get Weather ' + weather.message;
    else
        result = 'Right now its ' + weather.main.temp + ' degrees in ' + weather.name+" with "+ weather.weather[0].description;

}

function getWeather(city) {
    result = undefined;
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey;
    //console.log(url);
    let req = request(url, callback);
    while (result === undefined) {
        require('deasync').runLoopOnce();
    }
    console.log(result);
    return result;
}
