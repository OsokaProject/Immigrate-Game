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

let obstacles = [];
let obstacleWidth = 40;
let obstacleHeight = 54;
let obstaclePosX;
let obstaclePosY;
let obstacleSpeed = 2;
let speedIncrement = 0.02; // Speed increment per second
let obstacleTimer = 0;

let isGameOver = false;
let score = 0;

let bgElements = [];
let numElements = 20;
let minElementHeight = 60;
let maxElementHeight = 100;
let elementSpeed = 1;

let obstacleIndexTimer = 0;
const obstacleIndexInterval = 100;

let collisionAnimationDuration = 500; // Duration of collision animation in milliseconds
let isCollisionAnimating = false; // Flag to indicate if collision animation is active
let collisionAnimationStartTime = 0; // Start time of collision animation
let isBounceAnimating = true;
let BounceAnimationStartTime = 0;


function preload() {
  for (let i = 0; i < 3; i++) {
    let img = loadImage(`Dude${i}.png`);
    dudeImages.push(img);
  };

  let imgF = loadImage(`DudeF.png`);
  dudeImages[4] = imgF;



  for (let i = 0; i < 3; i++) {
    let img2 = loadImage(`Voenkom${i}.png`);
    obstacleImages.push(img2);
  };

 let imgVF = loadImage(`VoenkomF.png`);
 obstacleImages[4] = imgVF;

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
      let imgIndex = floor(random(6)); // Generate a random index for selecting a background image
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
  obstacleSpeed += speedIncrement * deltaTime / 1000;
  if (obstacleSpeed > 9) {
    obstacleSpeed = 9; // Limit the maximum speed to 9
  }

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


    // Animation logic



    if (!isAnimationPaused && millis() - lastFrameTime > 1000 / frameRate) {
        currentDudeIndex = (currentDudeIndex + 1) % 3;
        isCollisionAnimating = false;

        lastFrameTime = millis();
    }   else if (isCollisionAnimating && millis() - collisionAnimationStartTime <= 1000) { 
        isAnimationPaused = true;
   
        currentDudeIndex = 4; // Set the index for "DudeF.png" image
       
      } else { isAnimationPaused = false; }
    



    obstacleIndexTimer += deltaTime;
  if (obstacleIndexTimer >= obstacleIndexInterval) {
    currentObstacleIndex = (currentObstacleIndex + 1) % 3;
    obstacleIndexTimer = 0;
    isBounceAnimating = false;

    //} else if (millis() - BounceAnimationStartTime <= 1000) {
    //    currentObstacleIndex = 4;
    }

    // Draw hero image
    let currentDudeImage = dudeImages[currentDudeIndex];
    image(currentDudeImage, heroPosX, heroPosY, heroSize, heroSize);

    // Draw obstacle   

 

   


    //fill(255, 0, 0);
    //rect(obstaclePosX, obstaclePosY, obstacleWidth, obstacleHeight);

    // Move obstacle
    //obstaclePosX -= obstacleSpeed;
    //if (obstaclePosX + obstacleWidth < 0) {
    //  obstaclePosX = width;
    //  obstacleSpeed += 0.3; // Increase the speed with time
    //}





    obstacleTimer += deltaTime;

    if (obstacleTimer >= 8000 / (obstacleSpeed )) { // Generate an obstacle every 8 seconds (8000 milliseconds)
      obstacleTimer = 0; // Reset the timer
    
      let newObstacle = {
        x: width + random(2000),
        y: height - obstacleHeight -20, 
        speed: obstacleSpeed,
        isBouncing: false
      };
      obstacles.push(newObstacle);
      score += 100;
    }
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obstacle = obstacles[i];
      if (obstacle.speed < 8) {
      obstacle.x -= obstacle.speed;
    }else{obstacle.x -= 8};
      if (obstacle.x + obstacleWidth < 0) {
        obstacles.splice(i, 1);
      }
      console.log(obstacle.speed);
    // Check for collision

    let obstacleBottomHalfPosY = obstacle.y + obstacleHeight / 2;
              
    // Check for collision with the left border bottom half of the obstacle
              if (
                heroPosX + heroSize > obstacle.x &&
                heroPosX < obstacle.x &&
                heroPosY + heroSize > obstacleBottomHalfPosY
              ) {
                score -= 100;
                isCollisionAnimating = true;
                collisionAnimationStartTime = millis();
              }
          
              if (
                heroPosX + heroSize > obstacle.x &&
                heroPosX < obstacle.x + obstacleWidth &&
                heroPosY + heroSize > obstacle.y &&
                heroPosY < obstacle.y + obstacleHeight
              ) {
                if (heroPosY + heroSize > obstacleBottomHalfPosY) {
          
                } else {
                  heroPosY = obstacle.y - heroSize; // Position hero at the top of the obstacle
                  jumpForce = 5;
                  score += 100;
                  isBounceAnimating = true;
                  BounceAnimationStartTime = millis();
                  obstacle.isBouncing = true;
                  
                }
              }
          

    }

    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        let currentObstacleImage;
        if (obstacle.isBouncing) {
            currentObstacleImage = obstacleImages[4]; // Use the bouncing image
          } else {
            currentObstacleImage = obstacleImages[currentObstacleIndex]; // Use the normal image
          }
          image(currentObstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
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
