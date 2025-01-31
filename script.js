const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

// Game variables
let paddleHeight = 100, paddleWidth = 10;
let ballRadius = 10;
let playerPaddleY = (canvas.height - paddleHeight) / 2;
let computerPaddleY = playerPaddleY;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballDX = 4, ballDY = 4;
let speedIncrement = 0.2;  // Speed up ball when player hits it
let playerScore = 0;
let ballHits = 0;  // Track how many times the ball is hit by the player

// Controls
document.addEventListener("mousemove", (e) => movePaddle(e.clientY));
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    movePaddle(e.touches[0].clientY);
});

function movePaddle(positionY) {
    playerPaddleY = positionY - paddleHeight / 2;
    if (playerPaddleY < 0) playerPaddleY = 0;
    if (playerPaddleY + paddleHeight > canvas.height) playerPaddleY = canvas.height - paddleHeight;
}

function drawPaddle(x, y) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    // Change ball color based on hits
    if (ballHits >= 15) {
        ctx.fillStyle = "orange";  // Ball is on fire
    } else if (ballHits >= 10) {
        ctx.fillStyle = "yellow";  // Ball turns yellow
    } else {
        ctx.fillStyle = "white";  // Default ball color
    }

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${playerScore}`, canvas.width / 2 - 40, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles and ball
    drawPaddle(0, playerPaddleY);  // Player paddle on the left
    drawPaddle(canvas.width - paddleWidth, computerPaddleY);  // Computer paddle on the right
    drawBall();

    // Draw the scoreboard
    drawScore();

    // Move the ball
    ballX += ballDX;
    ballY += ballDY;

    // Ball-wall collisions
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballDY = -ballDY;
    }

    // Ball-player paddle collision
    if (
        ballX - ballRadius <= paddleWidth &&
        ballY > playerPaddleY &&
        ballY < playerPaddleY + paddleHeight
    ) {
        ballDX = -ballDX;
        ballDX *= 1 + speedIncrement;  // Speed up ball
        ballDY *= 1 + speedIncrement;
        playerScore++;  // Increase player score when they hit the ball
        ballHits++;  // Track hits

        // Check if player wins
        if (ballHits >= 20) {
            showWinnerScreen();
            return;  // Stop the game when the player wins
        }
    }

    // Ball-computer paddle collision (AI always hits perfectly)
    if (
        ballX + ballRadius >= canvas.width - paddleWidth &&
        ballY > computerPaddleY &&
        ballY < computerPaddleY + paddleHeight
    ) {
        ballDX = -ballDX;
    }

    // AI paddle movement (always perfectly aligns with ball)
    computerPaddleY = ballY - paddleHeight / 2;
    if (computerPaddleY < 0) computerPaddleY = 0;
    if (computerPaddleY + paddleHeight > canvas.height) computerPaddleY = canvas.height - paddleHeight;

    // Ball out of bounds (reset ball)
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        resetBall();
    }

    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = Math.sign(ballDX) * 4;
    ballDY = Math.sign(ballDY) * 4;
}

// Show "Winner Winner Chicken Dinner" screen
function showWinnerScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Winner Winner Chicken Dinner!", canvas.width / 2 - 220, canvas.height / 2 - 20);

    // Draw animated chickens
    let chickenImage = new Image();
    chickenImage.src = "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif";  // Funny chicken GIF
    chickenImage.onload = () => {
        ctx.drawImage(chickenImage, canvas.width / 2 - 150, canvas.height / 2 + 20, 300, 200);
    };
}

gameLoop();
