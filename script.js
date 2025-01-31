const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

// Game variables
let paddleHeight = 100, paddleWidth = 10;
let ballRadius = 10;
let paddleY = (canvas.height - paddleHeight) / 2;
let computerPaddleY = paddleY;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballDX = 4, ballDY = 4;
let speedIncrement = 0.2;  // Amount to increase ball speed after each player hit

// Scores
let playerScore = 0;
let computerScore = 0;

// Event listeners for both desktop and mobile touch
document.addEventListener("mousemove", (e) => movePaddle(e.clientY));
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();  // Prevent scrolling while playing
    movePaddle(e.touches[0].clientY);
});

function movePaddle(positionY) {
    paddleY = positionY - paddleHeight / 2;
    if (paddleY < 0) paddleY = 0;
    if (paddleY + paddleHeight > canvas.height) paddleY = canvas.height - paddleHeight;
}

function drawPaddle(x, y) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Player: ${playerScore}`, canvas.width / 4, 30);
    ctx.fillText(`Computer: ${computerScore}`, (3 * canvas.width) / 4, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles and ball
    drawPaddle(0, paddleY);
    drawPaddle(canvas.width - paddleWidth, computerPaddleY);
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

    // Ball-player paddle collision with speed increment
    if (
        ballX - ballRadius < paddleWidth &&
        ballY > paddleY &&
        ballY < paddleY + paddleHeight
    ) {
        ballDX = -ballDX;
        ballDX *= 1 + speedIncrement;  // Speed up ball
        ballDY *= 1 + speedIncrement;
    }

    // Ball-computer paddle collision (no speed increment)
    if (
        ballX + ballRadius > canvas.width - paddleWidth &&
        ballY > computerPaddleY &&
        ballY < computerPaddleY + paddleHeight
    ) {
        ballDX = -ballDX;
    }

    // Computer AI paddle movement
    computerPaddleY += (ballY - (computerPaddleY + paddleHeight / 2)) * 0.1;

    // Update scores if ball goes out of bounds
    if (ballX - ballRadius < 0) {
        computerScore++;  // Computer scores a point
        resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        playerScore++;  // Player scores a point
        resetBall();
    }

    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = Math.sign(ballDX) * 4;  // Reset speed to initial value but maintain direction
    ballDY = Math.sign(ballDY) * 4;
}

gameLoop();
