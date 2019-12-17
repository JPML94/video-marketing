var Airtable = require('airtable');
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY
})
var base = Airtable.base(process.env.AIRTABLE_BASE_ID);
var tableName = 'Full Video Analysis';
var viewName = 'Gallery';

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var cacheTimeoutMs = 5 * 1000;
var cachedResponse = null;
var cachedResponseDate = null;

app.get("/data", function(_, response) {
  if (cachedResponse && new Date() - cachedResponseDate < cacheTimeoutMs) {
    response.send(cachedResponse);
  } else {
    base(tableName).select({
      maxRecords: 10,
      view: viewName,
    }).firstPage(function(error, records) {
      if (error) {
        response.send({error: error});
      } else {
        cachedResponse = {
          records: records.map(record => {
            return {
              name: record.get('Index'),
              picture: record.get('Thumbnail'),
            };
          }),
        };
        cachedResponseDate = new Date();

        response.send(cachedResponse);
      }
    });
  }
});

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
