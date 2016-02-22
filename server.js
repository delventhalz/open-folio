var express = require('express');
var app = express();

var path = {
  index: __dirname + '/index.html'
};

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
  res.status(200).send(path.index);
});

app.listen(app.get('port'), function() {
  console.log('Node server running on port', app.get('port'));
});