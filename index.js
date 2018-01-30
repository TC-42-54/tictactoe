var http = require('http');
var fs = require('fs');
var mime = require('mime');
var io;
var server;
var routes = {};
var users = [];
var rooms = {};

const registerRoute = (url, func) => {
  routes[url] = func;
}

registerRoute('/', (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/html');
    res.write(fs.readFileSync(__dirname + '/index.html'));
    res.statusCode = 200;
    res.end();
  } catch(e) {
    res.statusCode = 500;
    res.statusMessage = "server error";
    res.end();
  }
});

registerRoute('public', (req, res) => {
  res.setHeader('Content-Type', mime.getType(req.url));
  if (fs.existsSync(__dirname + req.url)) {
    res.write(fs.readFileSync(__dirname + req.url));
    res.statusCode = 200;
  } else {
    res.statusCode = 404;
  }
  res.end();
});

registerRoute('404', (req, res) => {
  res.statusCode = 404;
  res.statusMessage = 'Route is not set.';
  res.end();
});



io = require('socket.io')(server = http.createServer(function (req, res) {
  if (typeof routes[req.url] !== "undefined") {
      routes[req.url](req, res);
  } else {
    routes['public'](req, res);
    res.end();
  }
}));
io.on('connection', c => {
  users.push(c.id);
  console.log("debut=========================");
  console.log(Object.keys(io.sockets.connected));
  console.log("fin=========================");
  if (users.length == 2) {
    var i = 0;
    Object.keys(io.sockets.connected).map(id => {
      io.sockets.connected[id].broadcast.emit('otherPlayerId', id, (i == 0) ? 'O' : 'X');
      i++;
    });
    /*Object.keys(io.sockets.connected).map(id => {
      io.sockets.socket[id].map(s => s.emit('otherPlayerId', Object.keys(io.sockets.connected).find(e !== id)));
    });*/
  }
  c.on('played', (sign, lIndex, cIndex, otherPlayer) => {
    console.log("played");
    c.broadcast.emit('played', sign, lIndex, cIndex);
  });
  c.on('disconnect', () => {
    users = users.filter(e => (e === c.id));
  });
  /*if (user.find(el => (c.id)))
  c.emit()*/
});
server.listen(8080);
