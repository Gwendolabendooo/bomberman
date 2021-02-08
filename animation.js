(function() { "use strict";

  /* Each sprite sheet tile is 16x16 pixels in dimension. */
  const SPRITE_SIZE = 16;

  var Animation = function(frame_set, delay) {

    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.

  };

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

      }

      //console.log("left:  " + controller.left.state + ", " + controller.left.active + "\nright: " + controller.right.state + ", " + controller.right.active + "\nup:    " + controller.up.state + ", " + controller.up.active);

    }

  };

  player = {

    animation:new Animation(),
    height:16,    width:16,
    x:0,          y:40 - 10,
    x_velocity:0, y_velocity:0

  };

  sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5]],
    image:new Image()

  };

  loop = function(time_stamp) {

    if (controller.up.active && !player.jumping) {

      player.y_velocity -= 0.05;

    }

    if (controller.left.active) {

      player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.x_velocity -= 0.05;

    }

    if (controller.right.active) {

      player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.x_velocity += 0.05;

    }

    if (controller.down.active) {

      player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.y_velocity += 0.05;

    }

    if (!controller.left.active && !controller.right.active) {

      player.animation.change(sprite_sheet.frame_sets[0], 20);

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

    if (player.x + player.width < 0) {

      player.x = buffer.canvas.width;

    } else if (player.x > buffer.canvas.width) {

      player.x = - player.width;
    }

    player.animation.update();

    render();

    window.requestAnimationFrame(loop);

  };

  render = function() {

    buffer.fillStyle = "#00ad7d";
    buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
    var z = 0;
    const posRect = [];
    while (z < 210) {
      var i = 0;
      while (i < 210) {
        buffer.fillStyle = "grey";
        buffer.fillRect(210 - i, 210 - z, 10, 10);
        posRect.push(new Array('210'- i, '210'- z));
        i += 20;
      } 
      z += 20;
    }
    
    //Collision
    for(var i= 0; i < posRect.length; i++){
      if (posRect[i][0] + 6 > player.x && posRect[i][0] < player.x + 10 && posRect[i][1] > player.y && posRect[i][1] < player.y + 16) {
        console.log("Collision", "x : ", posRect[i][0], player.x, "y : ", posRect[i][1], player.y, "rectd", posRect[i][0]+6);
        //Collision bas
        if (posRect[i][0] - 9 > player.x) {
          console.log("collision gauche");
          player.x = player.x - 1;
        }else if (posRect[i][0] + 5 < player.x) {
          console.log("collision droite");
          player.x = player.x + 1;
        }else if (posRect[i][1] - 15 > player.y ) {
          console.log("collision haut");
          player.y = player.y - 1;
        }else if (posRect[i][1] > player.y) {
          console.log("collision bas");
          player.y = player.y + 1;
        }
      }
    }

    buffer.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.x), Math.floor(player.y), SPRITE_SIZE, SPRITE_SIZE);
    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);

  };
  
  function bombe() {
    buffer.fillRect(25, 25, 100, 100);
  }

  document.querySelector("#bombe").addEventListener('click', event => {
    bombe();
    console.log("boom");
  });

  resize = function() {

    display.canvas.width = document.documentElement.clientWidth /3;

    if (display.canvas.width > document.documentElement.clientHeight) {

      display.canvas.width = document.documentElement.clientHeight;

    }

    display.canvas.height = display.canvas.width * 1;

    display.imageSmoothingEnabled = false;

  };

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  buffer.canvas.width = 230;
  buffer.canvas.height = 230;

  window.addEventListener("resize", resize);

  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  resize();

  sprite_sheet.image.addEventListener("load", function(event) {// When the load event fires, do this:

    window.requestAnimationFrame(loop);// Start the game loop.

  });

  sprite_sheet.image.src = "animation.png";// Start loading the image.

})();