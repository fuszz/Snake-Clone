function cell(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    return this
}

let snake = {
    headPosition : cell(400, 400, "R"),
    length: 10,
    snakeArray: [cell(400, 400)],
    color: 'rgba(255, 0, 0, 1)',
    direction: "R",
}

let game = {
    gameOver: false,
    gameInitiated: false,

    canvas: null,
    context: null,

    canvasWidth: 800,
    canvasHeight: 800,

    boardWidth: 40,
    boardHeight: 40,

    banner: null,
    points: 0,

    speed: 10,
    lastRefreshed: 0,
}

function init() {
    window.addEventListener("keydown", keyListener, false);
    game.canvas = document.getElementById('game');
    game.context = game.canvas.getContext('2d');
    game.canvasWidth = game.canvas.width;
    game.canvasHeight = game.canvas.height;

    game.banner = document.getElementById('banner');
    game.banner.innerText = "Press any arrow key to start the game";

    drawSnake();
}


function drawSnake() {
    game.context.fillStyle = snake.color;
    snake.snakeArray.forEach((element, index) => {
        game.context.fillRect(element.x, element.y, 20, 20);
    })
}


function redraw() {
    game.context.clearRect(0, 0, game.canvasWidth, game.canvasHeight) // czyszczenie tkaniny
    drawSnake()
}

function calculateNewHeadPosition(step){
    switch(snake.headPosition.direction){
        case "R":
            snake.headPosition.x += step;
            break;

        case "U":
            snake.headPosition.y -= step;
            break;

        case "L":
            snake.headPosition.x -= step;
            break;

        case "D":
            snake.headPosition.y += step;
            break;
    }
}

function calculateNewTailPosition(step){
    switch(snake.snakeArray[snake.length-1].direction){
        case "R":
            snake.snakeArray[snake.length-1].x += step;
            break;

        case "U":
            snake.snakeArray[snake.length-1].y -= step;
            break;

        case "L":
            snake.snakeArray[snake.length-1].x -= step;
            break;

        case "D":
            snake.snakeArray[snake.length-1].y += step;
            break;
    }
}

function checkGameOver(){
    if (snake.headPosition.x >= ((game.boardWidth - 1) * 20) || snake.headPosition.x < 0) {
        return true;
    }
    if (snake.headPosition.y >= ((game.boardHeight - 1) * 20) || snake.headPosition.y < 0 ) {
        return true;
    }
//     TODO add self-eating game Over
}

function gameOver(){
    game.gameOver = true;
    game.banner.innerText = "Game Over! You earned " + game.points + " points!";
}

function changeDirection(direction){
    if (direction === "L" && snake.direction !== "R") snake.direction = direction;
    if (direction === "R" && snake.direction !== "L") snake.direction = direction;
    if (direction === "U" && snake.direction !== "D") snake.direction = direction;
    if (direction === "D" && snake.direction !== "U") snake.direction = direction;
}

function animate(step){
    calculateNewHeadPosition(step);
    calculateNewTailPosition(step);
    redraw();
}

function fullPosition(step){
    if (checkGameOver()){
        gameOver();
        return;
    }

}

function gameLoop() {
    let step = 4;
    if (snake.headPosition.x % 20 === 0 && snake.headPosition.y % 20 === 0){
        fullPosition(step);
        animate(step);
    }
    else animate(step);

    console.log("Step: " + step);
    calculateNewHeadPosition(step);


    snake.snakeArray.unshift({ ...snake.headPosition });
    console.log(snake.headPosition);
    if (snake.snakeArray.length > snake.length){
        snake.snakeArray.pop();
    }

}

async function keyListener(e) {
    if (!game.gameInitiated && !game.gameOver) {
        game.banner.innerText = "Press any arrow key to start the game";
        game.gameInitiated = true;
        windows.setInterval(gameLoop, 10);
    }
    switch (e.keyCode) {
        case 37: // left arrow
            changeDirection("L");
            break;
        case 38: // up arrow
            changeDirection("U");
            break;
        case 39: // right arrow
            changeDirection("R");
            break;
        case 40: // down arrow
            changeDirection("D");
            break;
    }
}