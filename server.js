var http = require('http');

var alpha = [];
var beta = [];
var gamma = [];
var delta = [];
var epsilon = [];
var lambda = [];
var omicron = [];
var sigma = [];
var omega = [];

var listserv = [["alpha", alpha], ["beta", beta], ["gamma", gamma], ["delta", delta], ["epsilon", epsilon], ["lambda", lambda], ["omicron", omicron], ["sigma", sigma], ["omega", omega]];

httpServer = http.createServer(function(req, res){
    console.log('un user afficher la page');
});

httpServer.listen(3000);

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket){

  socket.emit('connexion');

  socket.on('room', function(data){
    socket.join(data);

    socket.on('position', function(data){
      listserv.forEach((room) => {
        if (room[1].length > 0) {
          for (var i = 0; i < room[1].length; i++) {
            if (room[1][i][1] == socket.id) {
              data.push(socket.id)
              socket.broadcast.to(room[0]).emit('posjoueur', data);
            }
          }
        }
      });
     })

     socket.on('bombe', function(data){
       console.log(data)
      listserv.forEach((room) => {
        if (room[1].length > 0) {
          for (var i = 0; i < room[1].length; i++) {
            if (room[1][i][1] == socket.id) {
              data.push(socket.id)
              socket.broadcast.to(room[0]).emit('bombeenemy', data);
            }
          }
        }
      });
     })

     socket.on('mort', function(data){
     listserv.forEach((room) => {
       if (room[1].length > 0) {
         for (var i = 0; i < room[1].length; i++) {
           if (room[1][i][1] == socket.id) {
             data = socket.id
             socket.broadcast.to(room[0]).emit('enemymort', data);
           }
         }
       }
     });
    })

    socket.on('timebomb', function(data){
      listserv.forEach((room) => {
        if (room[1].length > 0) {
          for (var i = 0; i < room[1].length; i++) {
            if (room[1][i][1] == socket.id) {
              socket.broadcast.to(room[0]).emit('tempsbombe', data);
            }
          }
        }
      });
     })

     socket.on('nbvie', function(data){
      listserv.forEach((room) => {
        if (room[1].length > 0) {
          for (var i = 0; i < room[1].length; i++) {
            if (room[1][i][1] == socket.id) {
              socket.broadcast.to(room[0]).emit('nbrvie', data);
            }
          }
        }
      });
     })

     socket.on('vitesse', function(data){
      listserv.forEach((room) => {
        if (room[1].length > 0) {
          for (var i = 0; i < room[1].length; i++) {
            if (room[1][i][1] == socket.id) {
              socket.broadcast.to(room[0]).emit('vitessej', data);
            }
          }
        }
      });
     })

     socket.on('newpseudo', function(data){
      listserv.forEach((room) => {
        if (data[1] == room[0] && room[1].length < 4) {
          room[1].push([data[0], socket.id]);
          io.sockets.to(room[0]).emit('pseudo', room[1]);
          } 
      })
     })

     socket.on('chef', function(data){
      listserv.forEach((room) => {
        if (room[1].length > 0) {
          console.log(room[1][0][1])
          for (var i = 0; i < room[1].length; i++) {
            console.log(socket.id, i, "erere", room[1][i][1])
            if (room[1][0][1] == socket.id) {
                socket.emit('vraichef', "Chef de partie")
              }
            }
          }
      });
     })
  })

 socket.on("disconnect", function(){
  listserv.forEach((room) => {
    if (room[1].length > 0) {
      for (var i = 0; i < room[1].length; i++) {
        if (room[1][i][1] == socket.id) {
          console.log(room[1], "avantdeco", room[1][i])
          room[1].splice(room[1][i], 1)
          io.sockets.to(room[0]).emit('pseudo', room[1]);
        }
      }
    }
  });
  socket.broadcast.emit('deco', socket.id);
  });
});

