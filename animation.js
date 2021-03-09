var socket = io.connect('http://localhost:3000');

document.querySelector("#btnjoue").addEventListener('click', event => {
        document.querySelector("#allroom").style.display = "none";
        document.querySelector("#game").style.display = "block";
      })

var room = ["alpha", "beta", "gamma", "delta", "epsilon", "lambda", "omicron", "sigma", "omega"];

let params = (new URL(document.location)).searchParams;
let roomname = params.get('room'); // la chaine de caractère "Jonathan Smith".

socket.on('connexion', function(data) {
        room.forEach((serv) => {
                if (roomname == serv) {
                  socket.emit('room', serv);
                }
        });
});

socket.on('vraichef', function(data) {
  document.querySelector("#explosion").disabled = false
  document.querySelector("#nbvie").disabled = false
  document.querySelector("#vitessej").disabled = false
});

var cpt = 0;
if (cpt === 0 ) {
        setInterval(function(){ 
                if (document.querySelector("#pseudoj") != null && cpt == 0 && document.querySelector("#pseudoj").innerHTML != "Pseudo") {
                        var newj = document.querySelector("#pseudoj").innerText;
                        const ctnj = [newj, roomname];
                        socket.emit('newpseudo', ctnj);
                        socket.emit('chef', 'chef?');
                        cpt++;
                } 
        }, 300);       
}

socket.on('pseudo', function(data) {
        var elements = document.getElementsByClassName('participantroom');
        while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
        }
        while(document.getElementsByClassName('participant').length > 0){
                document.getElementsByClassName('participant')[0].parentNode.removeChild(document.getElementsByClassName('participant')[0]);
        }
        console.log(data)
        data.forEach(element => document.querySelector("#invit").insertAdjacentHTML('beforeBegin', "<div class='participantroom'> <div class='pseudoroom'>"+ element[0] + "</div><img class='participant-img-room' src='./ressources/Face.png' alt=''> </div>"));
        data.forEach(element => document.querySelector("#participant").insertAdjacentHTML('beforeend', " <div class='participant'> <div class='pseudo'>"+ element[0] + "</div><img class='participant-img' src='./ressources/Face.png' alt=''> </div>"));
        document.querySelector("#nouveautes > div:nth-child(2)").insertAdjacentHTML('afterbegin', "<img src='./ressources/chef.png' id='chef' alt=''>");
      });

socket.on('deco', function(data) {
        console.log(data, 'explosion')
});

(function() { "use strict";

  /* Each sprite sheet tile is 16x16 pixels in dimension. */
  const SPRITE_SIZE = 256;
  const OBJECT_SIZE = 160;

  var now = new Date();
  var h  = now.getHours();
  var m  = now.getMinutes();
  var s = now.getSeconds();

  var tempsbombe = 1;

  var depart = 100000000;

  var m2 = 0;
  var s2 = 0;

  var mur=new Image();
  mur.src="./ressources/mur.png";

  var bomb=new Image();
  bomb.src="./ressources/bomb.png";

  var perso=new Image();
  perso.src="./ressources/Face.png";

  var immunise = 0;
  var dureeimmu = 0;

  var Animation = function(frame_set, delay) {

    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.

  };

  document.querySelector("#explosion").addEventListener('change', event => {
    socket.emit('timebomb', document.querySelector("#explosion").value);
  })

  document.querySelector("#nbvie").addEventListener('change', event => {
    socket.emit('nbvie', document.querySelector("#nbvie").value);
  })

  document.querySelector("#vitessej").addEventListener('change', event => {
    socket.emit('vitesse', document.querySelector("#vitessej").value);
  })

  socket.on('tempsbombe', function(data) {
    document.querySelector("#explosion").value = data
    document.querySelector("#valdelai").innerHTML = data + " secondes"
  })

  socket.on('nbrvie', function(data) {
    document.querySelector("#nbvie").value = data
    document.querySelector("#valdelai1").innerHTML = data + " vies"
  })

  socket.on('vitessej', function(data) {
    document.querySelector("#vitessej").value = data
    document.querySelector("#valdelai2").innerHTML = data + " normal"
  })

  Animation.prototype = {

    change:function(frame_set, delay = 15) {

      if (this.frame_set != frame_set) {

        this.count = 0;// Reset the count.
        this.delay = delay;// Set the delay.
        this.frame_index = 0;// Start at the first frame in the new frame set.
        this.frame_set = frame_set;// Set the new frame set.
        this.frame = this.frame_set[this.frame_index];// Set the new frame value.

      }

    },

    /* Call this on each game cycle. */
    update:function() {

      this.count ++;// Keep track of how many cycles have passed since the last frame change.

      if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

        this.count = 0;// Reset the count.
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame = this.frame_set[this.frame_index];// Change the current frame value.

      }

    }

  };

  var buffer, controller, display, loop, player, render, resize, sprite_sheet;

  buffer = document.createElement("canvas").getContext("2d");
  display = document.getElementById("canvas").getContext("2d");

  controller = {

    left:  { active:false, state:false },
    right: { active:false, state:false },
    up:    { active:false, state:false },
    down:  { active:false, state:false },

    keyUpDown:function(event) {

      var key_state = (event.type == "keydown") ? true : false;

      switch(event.keyCode) {

        case 37:// left key

          if (controller.left.state != key_state) controller.left.active = key_state;
          controller.left.state  = key_state;

        break;
        case 38:// up key

          if (controller.up.state != key_state) controller.up.active = key_state;
          controller.up.state  = key_state;

        break;
        case 39:// right key

          if (controller.right.state != key_state) controller.right.active = key_state;
          controller.right.state  = key_state;

        break;
        case 40:// right key

        if (controller.down.state != key_state) controller.down.active = key_state;
        controller.down.state  = key_state;

        break;
        case 32:// bombe

        document.getElementById('bombe').click()

        break;

      }

      //console.log("left:  " + controller.left.state + ", " + controller.left.active + "\nright: " + controller.right.state + ", " + controller.right.active + "\nup:    " + controller.up.state + ", " + controller.up.active);

    }

  };

  player = {

    animation:new Animation(),
    height:SPRITE_SIZE,    width:SPRITE_SIZE,
    x:0,          y:0,
    x_velocity:0, y_velocity:0

  };

  sprite_sheet = {

    frame_sets:[[0,1,2], [3,4,5], [6,7,8], [9,10,11], [0,3,6]],
    image:new Image()

  };

  loop = function(time_stamp) {

    if (controller.up.active) {
      player.animation.change(sprite_sheet.frame_sets[3], 10);
      player.y_velocity -= 0.80;

    }

    if (controller.left.active) {

      player.animation.change(sprite_sheet.frame_sets[2], 10);
      player.x_velocity -= 0.80;

    }

    if (controller.right.active) {

      player.animation.change(sprite_sheet.frame_sets[1], 10);
      player.x_velocity += 0.80;

    }

    if (controller.down.active) {

      player.animation.change(sprite_sheet.frame_sets[0], 10);
      player.y_velocity += 0.80;

    }

    if (!controller.left.active && !controller.right.active && !controller.down.active && !controller.up.active) {

      player.animation.change(sprite_sheet.frame_sets[4], 15);

    }

    player.x += player.x_velocity;
    player.y += player.y_velocity;
    player.x_velocity *= 0.9;
    player.y_velocity *= 0.9;

    if (player.y + player.height > buffer.canvas.height - 2) {

      player.jumping = false;
      player.y = buffer.canvas.height - 2 - player.height;
      player.y_velocity = 0;

    }

    if (player.x < 0) {

      player.x = 0;

    } else if (player.x > buffer.canvas.width - player.width) {

      player.x = buffer.canvas.width - player.width;
    } else if(player.y < 0){
      player.y = 0;
    }

    player.animation.update();

    render();

    window.requestAnimationFrame(loop);

    

  };


  var stockbomb = [];
  var explosion = [];
  var casex = 0;
  var casey = 0;
  var posj =[]
  var deces = 0
  var timerbomb = 4;
  var nbrvie = 3
  var idbombe = 0;
  var vitesse = 1;

  document.querySelector("#btnjoue").addEventListener('click', event => {
    now = new Date();
    h  = now.getHours();
    m  = now.getMinutes();
    s = now.getSeconds();
 
    depart = h*3600+m*60+s;
    console.log(depart)

    timerbomb = parseInt(document.querySelector("#explosion").value)
    nbrvie = parseInt(document.querySelector("#nbvie").value)
    vitesse = parseInt(document.querySelector("#vitessej").value)
    console.log(timerbomb)
    
  })

  socket.on('posjoueur', function(data) {
    if (posj.length > 0) {
      var estroom = 0;
      posj.forEach((room) => {
        if (room[3] == data[3]) {
          room[0] = data[0]
          room[1] = data[1]
          room[2] = data[2]
          room[3] = data[3]
        }else{
          estroom++
        }
        if (estroom == posj.length) {
          posj.push([Math.floor(data[0]), Math.floor(data[1]), data[2], data[3]])
        }
      });
    }else{
      posj.push([Math.floor(data[0]), Math.floor(data[1]), data[2], data[3]])
    }
  });

  socket.on('bombeenemy', function(data) {
    stockbomb.push([data[0], data[1], data[2], idbombe])
    idbombe++
  });

  socket.on('enemymort', function(data) {
    console.log(data)
  });
  
  render = function() {

    buffer.fillStyle = "white";
    buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
    var z = 0;
    const posRect = [];
    while (z < 210*4*2*2) {
      var i = 0;
      while (i < 210*4*2*2) {
        buffer.drawImage(mur, 3480 - i, 3480 - z, OBJECT_SIZE, OBJECT_SIZE);
        posRect.push(new Array('3480'- i, '3480'- z));
        i += OBJECT_SIZE * 2;
      } 
      z += OBJECT_SIZE * 2;
    }

    //bombe
    if (stockbomb.length > 0) {
      buffer.fillStyle = "red";
      for(var i=0; i < stockbomb.length; i++){
        buffer.drawImage(bomb, stockbomb[i][0], stockbomb[i][1], OBJECT_SIZE, OBJECT_SIZE);
      } 
    }

    //déplacement des autres joueurs
    posj.forEach((room) => {
      buffer.drawImage(sprite_sheet.image, room[2] * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, room[0], room[1], SPRITE_SIZE, SPRITE_SIZE);
    });

    //Timerbomb
    var now = new Date();
    var heure   = now.getHours();
    var minute  = now.getMinutes();
    var seconde = now.getSeconds();

    if (stockbomb.length > 0) {
      for(var i=0; i < stockbomb.length; i++){
        // console.log(stockbomb[i][2] + timerbomb, " < ", heure*3600+minute*60+seconde, "   ", timerbomb)
        if (stockbomb[i][2] + timerbomb < heure*3600+minute*60+seconde) {
          console.log("explosion", explosion);
          explosion.push(new Array(stockbomb[i][0], stockbomb[i][1], stockbomb[i][2] + timerbomb, idbombe));
          idbombe++
          stockbomb = stockbomb.filter(item => item !== stockbomb[i]);
        }
      } 
    }

    //Timer
    var temps = heure*3600+minute*60+seconde;
    var tempsrestant = depart + 60 * 2;
    if (temps < tempsrestant) {
      m2 = Math.trunc((tempsrestant - temps) / 60);
      s2 = (tempsrestant - temps) % 60;
      if (s2 < 10) {
        s2 = "0" + s2;
      }
      document.getElementById('timer').innerText = m2 + " : " + s2;
    }else{
      console.log("fin")
    }

    //Collision
    for(var i= 0; i < posRect.length; i++){
      if (posRect[i][0] + 96 > player.x && posRect[i][0] < player.x + OBJECT_SIZE && posRect[i][1] > player.y && posRect[i][1] < player.y + 256) {
        // console.log("Collision", "x : ", posRect[i][0], player.x, "y : ", posRect[i][1], player.y, "rectd", posRect[i][0]+96);
        //Collision bas
        if (posRect[i][0] - 144 > player.x) {
          // console.log("collision gauche");
          player.x = player.x - 8;
        }else if (posRect[i][0] + 80 < player.x) {
          // console.log("collision droite");
          player.x = player.x + 8;
        }else if (posRect[i][1] - 240 > player.y ) {
          // console.log("collision haut");
          player.y = player.y - 8;
        }else if (posRect[i][1] > player.y) {
          // console.log("collision bas");
          player.y = player.y + 8;
        }
      }
    }

    //Dans case
    var poscase = [];
    for(var i=0; i < cases.length; i++){
      if (cases[i][0] > player.x && cases[i][0] < player.x + OBJECT_SIZE && cases[i][1] > player.y && cases[i][1] < player.y + OBJECT_SIZE) {
        casex = cases[i][0];
        casey = cases[i][1];
        poscase = new Array(cases[i][0], cases[i][1]);
      }
    }

    //Explosion
    var vie = document.getElementById('vie');
      for(var explo=0; explo < explosion.length; explo++){
        if (explosion.length > 0 && explosion[0][2] + 2 > heure*3600+minute*60+seconde) {
            buffer.fillStyle = "red";
          for(var i=0; i < posRect.length; i++){
            if (posRect[i][0] == explosion[explo][0]) {
              buffer.fillRect(explosion[explo][0] - OBJECT_SIZE*3, explosion[explo][1], OBJECT_SIZE * 7, OBJECT_SIZE);
              if (poscase[0] > explosion[explo][0] - OBJECT_SIZE*3 && poscase[0] < explosion[explo][0] + OBJECT_SIZE*3 && poscase[1] == explosion[explo][1] && immunise == 0) {
                vie.removeChild(vie.lastChild);
                vie.removeChild(vie.lastChild);
                dureeimmu = heure*3600+minute*60+seconde;
                immunise = 1;
              }
            }else if(posRect[i][1] == explosion[explo][1]){
              buffer.fillRect(explosion[explo][0], explosion[explo][1] - OBJECT_SIZE*3, OBJECT_SIZE, OBJECT_SIZE * 7);
              if (poscase[1] > explosion[explo][1] - OBJECT_SIZE*3 && poscase[1] < explosion[explo][1] + OBJECT_SIZE*3 && poscase[0] == explosion[explo][0] && immunise == 0) {
                vie.removeChild(vie.lastChild);
                vie.removeChild(vie.lastChild);
                dureeimmu = heure*3600+minute*60+seconde;
                immunise = 1;
              }
            }else if(posRect[i][1] + OBJECT_SIZE == explosion[explo][1] && posRect[i][0] + OBJECT_SIZE == explosion[explo][0]){
              buffer.fillRect(explosion[explo][0] - OBJECT_SIZE*3, explosion[explo][1], OBJECT_SIZE * 7, OBJECT_SIZE);
              buffer.fillRect(explosion[explo][0], explosion[0][1] - OBJECT_SIZE*3, OBJECT_SIZE, OBJECT_SIZE * 7);
              if (poscase[0] > explosion[explo][0] - OBJECT_SIZE*3 && poscase[0] < explosion[explo][0] + OBJECT_SIZE*3 && poscase[1] == explosion[explo][1] && immunise == 0 || poscase[1] > explosion[explo][1] - OBJECT_SIZE*3 && poscase[1] < explosion[explo][1] + OBJECT_SIZE*3 && poscase[0] == explosion[explo][0] && immunise == 0) {
                vie.removeChild(vie.lastChild);
                vie.removeChild(vie.lastChild);
                dureeimmu = heure*3600+minute*60+seconde;
                immunise = 1;
              }
            }
          }
        }else{
          explosion.splice(0);
        }
    }

     //immunité
    if (dureeimmu != 0) {
      if (dureeimmu + 3 < heure*3600+minute*60+seconde) {
        immunise = 0;
        dureeimmu = 0;
      }
    }

    socket.emit('position', [player.x, player.y, player.animation.frame]);

    //fin de partie
    if (vie.children.length == 0) {
      socket.emit('mort', "mort");
      deces = 1
    }

    buffer.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.x), Math.floor(player.y), SPRITE_SIZE, SPRITE_SIZE);
    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
  };

  //cases
  const cases = [];
  var z = 0;
  while (z < 3640) {
    var i = 0;
    while (i < 3640) {
      cases.push(new Array('3640'- i, '3640'- z));
      i += OBJECT_SIZE;
    } 
    z += OBJECT_SIZE;
  }

  //bombe
  document.querySelector("#bombe").addEventListener('click', event => {
    var now = new Date();
    var heure   = now.getHours();
    var minute  = now.getMinutes();
    var seconde = now.getSeconds();
    console.log(heure * 3600 + minute * 60 + seconde)
    if (deces == 0 && tempsbombe + 3 < heure * 3600 + minute * 60 + seconde) {
      console.log(tempsbombe, heure * 3600 + minute * 60 + seconde)

      tempsbombe = heure * 3600 + minute * 60 + seconde;

      
      stockbomb.push(new Array(casex, casey, tempsbombe)); 
      socket.emit('bombe', [casex, casey, tempsbombe]); 
    }else{
        // sprite_sheet.image.src = "./ressources/mort.png";
    }
  });

  resize = function() {

    display.canvas.width = document.documentElement.clientWidth /2;

    if (display.canvas.width > document.documentElement.clientHeight) {

      display.canvas.width = document.documentElement.clientHeight;

    }

    display.canvas.height = display.canvas.width;

    display.imageSmoothingEnabled = false;

  };

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  buffer.canvas.width = 250*4*2*2;
  buffer.canvas.height = 250*4*2*2;

  window.addEventListener("resize", resize);

  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  resize();

  sprite_sheet.image.addEventListener("load", function(event) {// When the load event fires, do this:

    window.requestAnimationFrame(loop);// Start the game loop.

  });

  sprite_sheet.image.src = "./ressources/spriteperso4.png";// Start loading the image.

})();
