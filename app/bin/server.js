// Modules and dependencies
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// Handlers
const handlers = require('../middlewares/handlers');

// Constants
const PORT = 52346;
const USERS = [];

// Configure the static server directory to the public folder
app.use(express.static('./public'));

// io - all sockets
// socket - one especific socket

io.on('connection', socket => {

  socket.on('login', data => {
    let usernameTaken = false; 

    USERS.forEach(u => {
      if (u == data.username) {
        usernameTaken = true;
        return;
      }
    });

    if (usernameTaken) {
      socket.emit('login-response', { response: false, msg: 'username already taken' });
    } else {
      USERS.push(data.username);
      socket.emit('login-response', { response: true, msg: 'login successfully' });
      
      io.sockets.emit('server-message', data.username + ' has connected');
    }
  });

  socket.on('logout', data => {
    USERS.splice(USERS.indexOf(data.username), 1);
    
    if (USERS.length === 0) return;

    // socket.broadcast.emit();
  });

  // Listening for chat messages
  socket.on('outgoing', data => {
    // socket.get('username', (err, username) => {
    //   const eventArgs = {
    //     username: username,
    //     message: data.message
    //   };

    //   socket.emit('incoming', eventArgs, true);
    //   socket.broadcast.emit('incoming', eventArgs, false);      
    // });
  });


  // Listening when some user left the chat
  socket.on('disconnect', () => {
    console.log('debug - A socket has disconnected');
  });

  socket.on('connect', () => {
    console.log('debug - A socket has connect');
  });

  socket.on('message', data => {
    socket.broadcast.emit('message', data);
  });

});

server.listen(PORT, () => console.log(`debug - Server listening at port ${PORT}`));

app.get('/', handlers.handlePage);