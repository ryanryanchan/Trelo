var instance;

module.exports = {
  getInstance: function() {
    return instance;
  },
  setup: function(server) {
    instance = require("socket.io")(server);

    instance.on('connection', function(socket) {
      console.log('a user connected');

      socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      })
      .on('newcard', function(data, boardid){
        socket.to(boardid).emit(data);
        console.log('newcard');
        console.log(data);
      })
      .on('newlist', function(data, boardid){
        socket.to(boardid).emit(data);
        console.log('newlist');
        console.log(data);
      })
      .on('deletelist', function(data, boardid){
        socket.to(boardid).emit(data);
        console.log('deletelist');
        console.log(data);
      })
      .on('deletecard', function(data, boardid){
        socket.to(boardid).emit(data);
        console.log('deletecard');
        console.log(data);
      })
      .on('room', function(data){
        socket.join(data);
        console.log('user connected to room!');
      });
    });

  }
};