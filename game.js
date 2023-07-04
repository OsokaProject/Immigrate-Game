let canvasWidth = 1000;
let canvasHeight = 300;
let heroSize = 54;
let heroPosX, heroPosY;
let millisBarWidth = 10;
let gravity = 0.4;
let isJumping = false;
let jumpForce = 0;
let maxJumpForce = 15;
let timer = 0;
let isMouseButtonPressed = false;
let pressStartTime = 0;
let dudeImages = [];
let obstacleImages = [];
let currentDudeIndex = 0;
let currentObstacleIndex = 0;
let frameRate = 10;
let lastFrameTime = 0;
let isAnimationPaused = false;

let obstacleWidth = 40;
let obstacleHeight = 54;
let obstaclePosX;
let obstaclePosY;
let obstacleSpeed;

let isGameOver = false;
let score = 0;

let bgElements = [];
let numElements = 20;
let minElementHeight = 60;
let maxElementHeight = 100;
let elementSpeed = 1;





function preload() {
  for (let i = 0; i < 3; i++) {
    let img = loadImage(`Dude${i}.png`);
    dudeImages.push(img);
  };
  for (let i = 0; i < 3; i++) {
    let img2 = loadImage(`Voenkom${i}.png`);
    obstacleImages.push(img2);
  };
}

function setup() {

  canvasWidth = windowWidth;
  createCanvas(canvasWidth, canvasHeight);

  background(0);
  textSize(12);
  textAlign(CENTER, CENTER);

  heroPosX = width / 2 - heroSize / 2;
  heroPosY = 250 - heroSize / 2;

  obstaclePosX = width;
  obstaclePosY = 250 - obstacleHeight / 2;
  obstacleSpeed = 2; // Initial speed of the obstacle
  score = 0;

  // Calculate the total width required for all the elements
  let totalWidth = numElements * 108;

  // Calculate the starting position for the first element
  let startX = width + totalWidth;

    // Initialize the bgElements array with random positions and heights
    for (let i = 0; i < numElements; i++) {
      let elementHeight = 100;//random(minElementHeight, maxElementHeight);
      let elementY = 160;
      let elementX = startX + i * 108;
      let imgIndex = floor(random(5)); // Generate a random index for selecting a background image
      let img = loadImage(`bg${imgIndex}.png`); // Load the random background image
      bgElements.push({ x: elementX, y: elementY, height: elementHeight, image: img });
    }
}

function windowResized() {
  canvasWidth = windowWidth;
  resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
  background(0);
  fill(100, 100, 100);
  rect(0, 290, canvasWidth, 2);

      // Draw score text
      if (score < 0) {
        fill(20, 20, 20); // Set text color to red if score is negative
      } else {
        fill(50, 50, 50); // Set text color to green if score is non-negative
      }
      
      textSize(126);
      text( score, canvasWidth/2, canvasHeight/2);


        // Update the positions of the bgElements with parallax effect
        for (let i = 0; i < bgElements.length; i++) {
          let element = bgElements[i];
          element.x -= obstacleSpeed * 0.5; // Adjust the parallax effect by multiplying obstacleSpeed
      
          // Reset the position of the element when it goes off the left side of the canvas
          if (element.x + width < 0) {
            element.x = width;
      
          }
        }
      
          // Draw the bgElements with the parallax effect
          for (let i = 0; i < bgElements.length; i++) {
            let element = bgElements[i];
            image(element.image, element.x, element.y, 108, element.height);
            //rect(element.x, element.y, 108, element.height);
          }
        

  if (!isGameOver) { 
    // Draw millis bar
   

   fill(0, 255, 0);
   rect(heroPosX + 51, heroPosY + 30, 2, map(millisBarWidth, 0, -3000, 0, 50));

    // Draw "click to start" text
    //fill(255);
    //if (!isJumping) {
    //  text("Click to Start", width / 2, height / 2);
    //}


    



    //fill(255);
    //text(formatTime(timer), width - 50, 10);

    // Animation logic
    if (!isAnimationPaused && millis() - lastFrameTime > 1000 / frameRate) {
      currentDudeIndex = (currentDudeIndex + 1) % dudeImages.length;
      currentObstacleIndex = (currentObstacleIndex + 1) % obstacleImages.length;
      lastFrameTime = millis();
    } 

    // Draw hero image
    let currentDudeImage = dudeImages[currentDudeIndex];
    image(currentDudeImage, heroPosX, heroPosY, heroSize, heroSize);

    // Draw obstacle   
    let currentObstacleImage = obstacleImages[currentObstacleIndex];
    image(currentObstacleImage, obstaclePosX, obstaclePosY, obstacleWidth, obstacleHeight);
   


    //fill(255, 0, 0);
    //rect(obstaclePosX, obstaclePosY, obstacleWidth, obstacleHeight);

    // Move obstacle
    //obstaclePosX -= obstacleSpeed;
    //if (obstaclePosX + obstacleWidth < 0) {
    //  obstaclePosX = width;
    //  obstacleSpeed += 0.3; // Increase the speed with time
    //}


    if (obstaclePosX + obstacleWidth < 0) {
      if (random() < 0.01) { // Adjust the probability (0.01) to control the frequency of appearance
        obstaclePosX = width;
        //obstaclePosY = random(150, 250 - obstacleHeight / 2); // Randomize obstacle's vertical position
        obstacleSpeed += 0.05; // Increase the speed with time
        score += 100;
      }
    } else {
      obstaclePosX -= obstacleSpeed;
    }




    // Jump logic
    if (isJumping) {
      heroPosY -= jumpForce;
      jumpForce -= gravity;

      if (heroPosY >= 250 - heroSize / 2) {
        heroPosY = 250 - heroSize / 2;
        isJumping = false;
        jumpForce = 0;
        isAnimationPaused = false; // Resume animation when the character lands
      } else {
        isAnimationPaused = true; // Pause animation when the character jumps
      }
    }

    // Apply gravity
    if (!isJumping && heroPosY < 250 - heroSize / 2) {
      heroPosY += gravity;
    }

    // Check for collision

    let obstacleBottomHalfPosY = obstaclePosY + obstacleHeight / 2;

    // Check for collision with the left border bottom half of the obstacle
    if (
      heroPosX + heroSize > obstaclePosX &&
      heroPosX < obstaclePosX &&
      heroPosY + heroSize > obstacleBottomHalfPosY
    ) {
      score -= 100;
    }

    if (
      heroPosX + heroSize > obstaclePosX &&
      heroPosX < obstaclePosX + obstacleWidth &&
      heroPosY + heroSize > obstaclePosY &&
      heroPosY < obstaclePosY + obstacleHeight
    ) {
      if (heroPosY + heroSize > obstaclePosY + obstacleHeight / 2) {

      } else {
        heroPosY = obstaclePosY - heroSize; // Position hero at the top of the obstacle
        jumpForce = 5;
        score += 100;
      }
    }


  } else {
    // Game over logic
    fill(255);
    text("Game Over", width / 2, height / 2);
  }
}

function mousePressed() {
  if (!isGameOver) {
    if (!isJumping) {
      if (!isMouseButtonPressed) {
        pressStartTime = millis();
        isMouseButtonPressed = true;
      }
    } else {
      pressStartTime = millis();
      isMouseButtonPressed = true;
    }
  }
}

function mouseReleased() {
  if (!isGameOver && !isJumping && isMouseButtonPressed) {
    isJumping = true;
    let pressDuration = millis() - pressStartTime;
    let cappedDuration = min(pressDuration, 1000); // Cap the duration at 2000 milliseconds (2 seconds)
    jumpForce = map(cappedDuration, 0, 1000, 0, maxJumpForce); // Adjust the mapping to control the jump height
    isMouseButtonPressed = false;
    millisBarWidth = 0; // Reset the millis bar width
    isAnimationPaused = true; // Pause animation when the character jumps
  };
  if (isJumping) {
    let pressDuration = millis() - pressStartTime;
    let cappedDuration = min(pressDuration, 1000); // Cap the duration at 2000 milliseconds (2 seconds)
    jumpForce = map(cappedDuration, 0, 1000, 0, maxJumpForce); // Adjust the mapping to control the jump height
    isMouseButtonPressed = false;
    millisBarWidth = 0; // Reset the millis bar width
    isAnimationPaused = true; // Pause animation when the character jumps
  }

}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainderSeconds = seconds % 60;
  return nf(minutes, 2) + ":" + nf(remainderSeconds, 2);
}

function updateTimer() {
  if (!isGameOver && !isJumping) {
    timer++;
  }
}

function updateMillisBar() {
  if (isMouseButtonPressed) {
    millisBarWidth = min(millis() - pressStartTime, 3000); // Cap the millis bar width at 3000
  }
}

setInterval(updateTimer, 1000);
setInterval(updateMillisBar, 10);
