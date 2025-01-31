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

// Controls
document.addEventListener("mousemove", movePaddle);

function movePaddle(e) {
    paddleY = e.clientY - paddleHeight / 2;
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

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle(0, paddleY);
    drawPaddle(canvas.width - paddleWidth, computerPaddleY);

    ballX += ballDX;
    ballY += ballDY;

    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballDY = -ballDY;
    }

    if (ballX - ballRadius < paddleWidth &&
        ballY > paddleY && ballY < paddleY + paddleHeight) {
        ballDX = -ballDX;
    }

    if (ballX + ballRadius > canvas.width - paddleWidth &&
        ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
        ballDX = -ballDX;
    }

    computerPaddleY += (ballY - (computerPaddleY + paddleHeight / 2)) * 0.1;

    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballDX = -ballDX;
    }

    drawBall();
    requestAnimationFrame(gameLoop);
}

gameLoop();
