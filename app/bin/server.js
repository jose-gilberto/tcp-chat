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

io.sockets.on('connection', socket => {

  socket.on('new user', data => {
    let usernameTaken;

    // Check if the nickname already exists
    USERS.forEach( user => {
      if (user.toLowerCase() == data.username.toLowerCase()) {
        usernameTaken = true;
        return;
      }
    });

    if (usernameTaken) {
      // Send a notification to cliente that username is already taken
      socket.emit('username in use');
    } else {
      // Create a new username
      socket.set('username', data.username, () => {
        // Update users array
        USERS.push(data.username);
        // Send welcome message
        socket.emit(`welcome ${data.username} - ${USERS}`);
        // Broadcast to other clients that a user has joined
        socket.broadcast.emit(`user joined ${data.username} - ${USERS}`);
      });
    }
  });

  // Listening for chat messages
  socket.on('outgoing', data => {
    socket.get('username', (err, username) => {
      const eventArgs = {
        username: username,
        message: data.message
      };

      socket.emit('incoming', eventArgs, true);
      socket.broadcast.emit('incoming', eventArgs, false);      
    });
  });

  // Listening when some user left the chat
  socket.on('disconnect', () => {
    socket.get('username', (err, username) => {
      // Remove the user from USERS array
      USERS.splice(USERS.indexOf(username), 1);
      // Verify if exists any user to broadcast message
      if (USERS.length === 0) return;
      // Notify all users that someone has left the chat room
      socket.broadcast.emit(`user left ${username} - ${USERS}`);
      console.log('user disconnected');
    })
  })

});

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

app.get('/', handlers.handlePage);