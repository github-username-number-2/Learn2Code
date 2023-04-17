export default{info:{display:"Pong"},actionString:`
{}

---

This tutorial will guide you through writing the game pong.

---

Add a file named "index.html"

<{f
index.html
}>

---

Start with the DOCTYPE declaration and the html, head, body and title tags:
<[text/html
<!DOCTYPE html>
<html>
  <head>
    <title>Pong</title>
  </head>

  <body>
  </body>
</html>
]>

<{c s index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Pong</title>
  </head>

  <body>
  </body>
</html>
}>

---

Write a script tag linking to a file named "script.js" The file doesn't exist yet, but will be created in the next step.
<[text/html
<!DOCTYPE html>
<html>
  <head>
    <title>Pong</title>
  </head>

  <body>
    <script src="main.js"></script>
  </body>
</html>
]>

<{c s index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Pong</title>
  </head>

  <body>
    <script src="main.js"></script>
  </body>
</html>
}>

---

Create a file named "main.js"
<{f
main.js
}>

---

Write a test script in "main.js":
<[text/javascript
alert("Hello World");
]>

<{c s main.js
alert("Hello World");
}>

---

Click the run button.
>>>

---

You should see an alert pop up. We can now start writing the JavaScript code for pong.

---

Details for the structure for pong are as follows:

The index.html file should have all the elements for the paddles, start button, and other page details, like the surrounding box for example.

First, the program should wait for the user to click the start button. After it is pressed, the game is run.

To start, the direction of the ball is set to the right of the screen.

Then, a loop is created that will run every 10 milliseconds. This is 100 times per second. Every time it runs, it will look for collisions. If any are found, it will look at the axis of collision and reverse the ball's direction in the perpendicular axis, and add a small random value to the ball's vertical speed. This will be explained more later. It will then look at the ball's direction, and move it a certain distance in that direction. Even though the ball is not moving constantly, moving it a small amount 100 times per second will make it look like it is moving constantly.

If a collision where the ball contacts the left or right edge is ever found, a function is called that will reset everything, display the start button, and display "Player x wins"

---

Write in all the HTML elements that will be used, and a link to a CSS file:
<[text/html
<!DOCTYPE html>
<html>
  <head>
    <title>Pong</title>

    <link rel="stylesheet" href="main.css">
  </head>

  <body>
    <div id="game">
      <button id="start">Start</button>

      <div id="ball"></div>
      <div id="paddle1" class="paddle"></div>
      <div id="paddle2" class="paddle"></div>
    </div>

    <script src="main.js"></script>
  </body>
</html>
]>

<{c s index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Pong</title>

    <link rel="stylesheet" href="main.css">
  </head>

  <body>
    <div id="game">
      <button id="start">Start</button>

      <div id="ball"></div>
      <div id="paddle1" class="paddle"></div>
      <div id="paddle2" class="paddle"></div>
    </div>

    <script src="main.js"></script>
  </body>
</html>
}>

---

Now create a file named "main.css"
<{f
main.css
}>

---

First style the game container:
<[text/css
#game {
  position: absolute;
  width: 800px;
  height: 500px;
  border: 2px solid #000000;
}
]>

<{c s main.css
#game {
  position: absolute;
  width: 800px;
  height: 500px;
  border: 2px solid #000000;
}
}>

This sets the width and height in pixels. It also sets the thickness in pixels of the border, type of border, and color of border.


---

Next, write the styles for the start button:
<[text/css
#game {
  position: absolute;
  width: 800px;
  height: 500px;
  border: 2px solid #000000;
}

#start {
  position: absolute;
  left: 375px;
  top: 235px;
  z-index: 1;
  width: 50px;
  height: 30px;
  background-color: #00ee00;
}
]>

<{c a main.css 


#start {
  position: absolute;
  left: 375px;
  top: 235px;
  z-index: 1;
  width: 50px;
  height: 30px;
  background-color: #00ee00;
}
}>

---

Now style the rest of the elements:
<[text/css
#game {
  position: absolute;
  width: 800px;
  height: 500px;
  border: 2px solid #000000;
}

#start {
  position: absolute;
  left: 375px;
  top: 235px;
  z-index: 1;
  width: 50px;
  height: 30px;
  background-color: #00ee00;
}

.paddle {
  position: absolute;
  width: 20px;
  height: 50px;
  background-color: #000000;
}

#paddle1 {
  left: 30px;
}

#paddle2 {
  right: 30px;
}

#ball {
  position: absolute;
  left: 380px;
  top: 230px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #dd0000;
}
]>

<{c a main.css 


.paddle {
  position: absolute;
  width: 20px;
  height: 50px;
  background-color: #000000;
}

#paddle1 {
  left: 30px;
}

#paddle2 {
  right: 30px;
}

#ball {
  position: absolute;
  left: 380px;
  top: 230px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #dd0000;
}
}>

---

Click the run button.
>>>

---

Now that all the HTML and CSS is done, we can start programming the JS. To move the paddles, we will need to know if the up/down keys are currently being pressed. After deleting the alert function, declare the variables \`p1Up\`, \`p1Down\`, \`p2Up\` and \`p2Down\`. These will store the current state of the keys: pressed or not pressed. Then write the event listener functions. The file should then look like this:
<[text/javascript
var p1Up, p1Down, p2Up, p2Down;

document.onkeydown = function (event) {
  var key = event.key;

  if (key === "w") {
    p1Up = true;
  }
  if (key === "s") {
    p1Down = true;
  }
  if (key === "ArrowUp") {
    p2Up = true;
  }
  if (key === "ArrowDown") {
    p2Down = true;
  }
};
document.onkeyup = function (event) {
  var key = event.key;

  if (key === "w") {
    p1Up = false;
  }
  if (key === "s") {
    p1Down = false;
  }
  if (key === "ArrowUp") {
    p2Up = false;
  }
  if (key === "ArrowDown") {
    p2Down = false;
  }
};
]>
Every time a key is pressed down, the function will check which key is being pressed, and set the corresponding variable to \`true\`. The same is done when keys are released, but the corresponding variable is set to \`false\`.

<{c s main.js
var p1Up, p1Down, p2Up, p2Down;

document.onkeydown = function (event) {
  var key = event.key;

  if (key === "w") {
    p1Up = true;
  }
  if (key === "s") {
    p1Down = true;
  }
  if (key === "ArrowUp") {
    p2Up = true;
  }
  if (key === "ArrowDown") {
    p2Down = true;
  }
};
document.onkeyup = function (event) {
  var key = event.key;

  if (key === "w") {
    p1Up = false;
  }
  if (key === "s") {
    p1Down = false;
  }
  if (key === "ArrowUp") {
    p2Up = false;
  }
  if (key === "ArrowDown") {
    p2Down = false;
  }
};
}>

---

Now we will define all variables linking to the HTML elements that the program will interact with. Write the following code at the end of the file:
<[text/javascript
var startButton = document.getElementById("start"),
  player1Paddle = document.getElementById("paddle1"),
  player2Paddle = document.getElementById("paddle2"),
  ball = document.getElementById("ball");
]>

<{c a main.js 


var startButton = document.getElementById("start"),
  player1Paddle = document.getElementById("paddle1"),
  player2Paddle = document.getElementById("paddle2"),
  ball = document.getElementById("ball");
}>

---

All of the set up for the main loop is complete. Write the code to detect when the start button is clicked and create the main loop, at the end of your file:
<[text/javascript
var interval;
startButton.onclick = function () {
  startButton.style.display = "none";

  var ballSpeedX = 1,
    ballSpeedY = 0;

  interval = setInterval(function () {
  }, 10);
};
]>
When the start button is clicked, the function will hide the button, set the ball speed, and start the loop.

<{c a main.js 


var interval;
startButton.onclick = function () {
  startButton.style.display = "none";

  var ballSpeedX = 1,
    ballSpeedY = 0;

  interval = setInterval(function () {
  }, 10);
};
}>

---

Write the code for paddle movement. That section of code should then look like this:
<[text/javascript
var interval;
startButton.onclick = function () {
  startButton.style.display = "none";

  var ballSpeedX = 1,
    ballSpeedY = 0;

  interval = setInterval(function () {
    var paddle1Top = paddle1.offsetTop,
      paddle1Bottom = paddle1Top + 50,
      paddle2Top = paddle2.offsetTop,
      paddle2Bottom = paddle2Top + 50;

    if (p1Up && paddle1Top > 1) {
      player1Paddle.style.top = paddle1Top - 1 + "px";
    }
    if (p1Down && paddle1Bottom < 499) {
      player1Paddle.style.top = paddle1Top + 1 + "px";
    }
    if (p2Up && paddle2Top > 1) {
      player2Paddle.style.top = paddle2Top - 1 + "px";
    }
    if (p2Down && paddle2Bottom < 499) {
      player2Paddle.style.top = paddle2Top + 1 + "px";
    }
  }, 10);
};
]>
This code first defines the current positions of the paddles. Then, if the up/down key is pressed and the paddle is within range, the paddle is moved. The range is offset by 1, because if the paddle is on the edge it is considered within range, and can be moved 1 pixel out of range.

<{c i main.js 48 0
    var paddle1Top = paddle1.offsetTop,
      paddle1Bottom = paddle1Top + 50,
      paddle2Top = paddle2.offsetTop,
      paddle2Bottom = paddle2Top + 50;

    if (p1Up && paddle1Top > 1) {
      player1Paddle.style.top = paddle1Top - 1 + "px";
    }
    if (p1Down && paddle1Bottom < 499) {
      player1Paddle.style.top = paddle1Top + 1 + "px";
    }
    if (p2Up && paddle2Top > 1) {
      player2Paddle.style.top = paddle2Top - 1 + "px";
    }
    if (p2Down && paddle2Bottom < 499) {
      player2Paddle.style.top = paddle2Top + 1 + "px";
    }
}>

---

You can now run your code to see that paddles respond to user input (w, s, up arrow, down arrow).

---

Write the collision logic to detect collisions with the outer left and right walls. That section of code should then look like this:
<[text/javascript
var interval;
startButton.onclick = function () {
  startButton.style.display = "none";

  var ballSpeedX = 1,
    ballSpeedY = 0;

  interval = setInterval(function () {
    var paddle1Top = paddle1.offsetTop,
      paddle1Bottom = paddle1Top + 50,
      paddle2Top = paddle2.offsetTop,
      paddle2Bottom = paddle2Top + 50;

    if (p1Up && paddle1Top > 1) {
      player1Paddle.style.top = paddle1Top - 1 + "px";
    }
    if (p1Down && paddle1Bottom < 499) {
      player1Paddle.style.top = paddle1Top + 1 + "px";
    }
    if (p2Up && paddle2Top > 1) {
      player2Paddle.style.top = paddle2Top - 1 + "px";
    }
    if (p2Down && paddle2Bottom < 499) {
      player2Paddle.style.top = paddle2Top + 1 + "px";
    }

    var ballX = ball.offsetLeft,
      ballY = ball.offsetTop;


    if (ballX <= 0) {
      endGame("Player 2");
      return;
    }
    if (ballX >= 760) {
      endGame("Player 1");
      return;
    }
  }, 10);
};
]>
This code simply checks if the ball's X position is 0 pixels away from the left edge and 40 pixels away from the right edge. If either are true, the \`endGame\` function is called. The \`endGame\` function will be written later.

<{c i main.js 65 0 

    var ballX = ball.offsetLeft,
      ballY = ball.offsetTop;

    if (ballX <= 0) {
      endGame("Player 2");
      return;
    }
    if (ballX >= 760) {
      endGame("Player 1");
      return;
    }
}>

---

Now write the logic to detect collisions with the paddles. That section of code should then look like this:
<[text/javascript
if (ballX <= 0) {
  endGame("Player 2");
  return;
}
if (ballX >= 760) {
  endGame("Player 1");
  return;
}

if (ballX < 50 && ballX > 30) {
  if (ballY > paddle1Top - 40 && ballY < paddle1Bottom) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 3;
  }
}
if (ballX > 710 && ballX < 730) {
  if (ballY > paddle2Top - 40 && ballY < paddle2Bottom) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 3;
  }
}
]>
This checks if the ball's X position is within range to be contacted by a paddle. If it is, it checks if the Y position is between the paddle's top and bottom. If so, reverse the X speed and add a small random value (can be negative) to the Y speed.

<{c i main.js 77 0 

    if (ballX < 50 && ballX > 30) {
      if (ballY > paddle1Top - 40 && ballY < paddle1Bottom) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY = (Math.random() - 0.5) * 3;
      }
    }
    if (ballX > 710 && ballX < 730) {
      if (ballY > paddle2Top - 40 && ballY < paddle2Bottom) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY = (Math.random() - 0.5) * 3;
      }
    }
}>

---

The last collision related code is the code to check collisions with the top and bottom walls:
<[text/javascript
if (ballX < 50 && ballX > 30) {
  if (ballY > paddle1Top - 40 && ballY < paddle1Bottom) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 3;
  }
}
if (ballX > 710 && ballX < 730) {
  if (ballY > paddle2Top - 40 && ballY < paddle2Bottom) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 3;
  }
}

if (ballY <= 0) {
  ballSpeedY = -ballSpeedY;
}
if (ballY >= 460) {
  ballSpeedY = -ballSpeedY;
}
]>
If a collision is detected, the vertical speed is reversed.

<{c i main.js 90 0 

    if (ballY <= 0) {
      ballSpeedY = -ballSpeedY;
    }
    if (ballY >= 460) {
      ballSpeedY = -ballSpeedY;
    }
}>

---

Write the 2 lines of code for moving the ball:
<[text/javascript
if (ballX < 50 && ballX > 30) {
  if (ballY > paddle1Top - 40 && ballY < paddle1Bottom) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 3;
  }
}
if (ballX > 710 && ballX < 730) {
  if (ballY > paddle2Top - 40 && ballY < paddle2Bottom) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 3;
  }
}

if (ballY <= 0) {
  ballSpeedY = -ballSpeedY;
}
if (ballY >= 460) {
  ballSpeedY = -ballSpeedY;
}

ball.style.left = ballX + ballSpeedX + "px";
ball.style.top = ballY + ballSpeedY + "px";
]>

<{c i main.js 97 0 

    ball.style.left = ballX + ballSpeedX + "px";
    ball.style.top = ballY + ballSpeedY + "px";
}>

---

Now, all that is left to do is the \`endGame\` function. Add this code to the very end of the file:
<[text/javascript
function endGame(winner) {
  clearInterval(interval);

  alert(winner + " Wins");

  ball.style.left = "380px";
  ball.style.top = "230px";

  startButton.style.display = "block";
}
]>

<{c a main.js 


function endGame(winner) {
  clearInterval(interval);

  alert(winner + " Wins");
  
  ball.style.left = "380px";
  ball.style.top = "230px";

  startButton.style.display = "block";
}
}>

---

You can now run your code.
>>>
`};