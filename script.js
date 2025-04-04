function cell(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    return this
}

let snake = {
    headCell : cell(400, 400, "R"),

    length: 2,
    snakeArray: [{...cell(400, 400, "R")}, {...cell(380, 400, "R")}],
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
    cacheDirection: "R",

    apple: {
        x: null,
        y: null,
    },
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
    // Print snake
    game.context.fillStyle = 'rgb(255, 0, 0)';
    game.context.fillRect(snake.headCell.x, snake.headCell.y, 20, 20);
    snake.snakeArray.forEach((element, index) => {
        game.context.fillRect(element.x, element.y, 20, 20);
    })

    // Print apple
    if (game.apple.x === null) return;
    game.context.fillStyle = 'rgb(210,140,0)';
    game.context.fillRect(game.apple.x, game.apple.y, 20, 20);
}


function redraw() {
    game.context.clearRect(0, 0, game.canvasWidth, game.canvasHeight) // czyszczenie tkaniny
    drawSnake()
}

function calculateNewHeadPosition(step){
    switch(snake.headCell.direction){
        case "R":
            snake.headCell.x += step;
            break;

        case "U":
            snake.headCell.y -= step;
            break;

        case "L":
            snake.headCell.x -= step;
            break;

        case "D":
            snake.headCell.y += step;
            break;
    }
}

function calculateNewTailPosition(step) {
    if (snake.snakeArray[snake.length - 1]) {
        switch (snake.snakeArray[snake.length - 1].direction) {
            case "R":
                snake.snakeArray[snake.length - 1].x += step;
                break;

            case "U":
                snake.snakeArray[snake.length - 1].y -= step;
                break;

            case "L":
                snake.snakeArray[snake.length - 1].x -= step;
                break;

            case "D":
                snake.snakeArray[snake.length - 1].y += step;
                break;
        }
    }
}

function checkGameOver(){
    if (snake.headCell.x > ((game.boardWidth - 1) * 20) || snake.headCell.x < 0) {
        return true;
    }
    if (snake.headCell.y > ((game.boardHeight - 1) * 20) || snake.headCell.y < 0 ) {
        return true;
    }
    return snake.snakeArray.slice(1).some(element =>
        snake.headCell.x === element.x && snake.headCell.y === element.y
    );
    return false;
}

function checkSelfEating(){
    game.gameOver = snake.snakeArray.slice(1).some(element =>
        snake.headCell.x === element.x && snake.headCell.y === element.y);
}

function gameOver(){
    game.gameOver = true;
    game.banner.innerText = "Game Over! You earned " + game.points + " points!";
    if (game.points === game.boardHeight * game.boardWidth){
        game.banner.innerText = "YOU WON!!!";
        game.banner.style.backgroundColor = "green";

    }
}

function changeDirection(direction){
    if (direction === "L" && game.cacheDirection !== "R") game.cacheDirection = direction;
    if (direction === "R" && game.cacheDirection !== "L") game.cacheDirection = direction;
    if (direction === "U" && game.cacheDirection !== "D") game.cacheDirection = direction;
    if (direction === "D" && game.cacheDirection !== "U") game.cacheDirection = direction;
}

function animate(step){
    calculateNewHeadPosition(step);
    calculateNewTailPosition(step);
    redraw();
}

function eatApple(){

    if (game.apple.x === snake.headCell.x && game.apple.y === snake.headCell.y) {
        game.apple.x = null;
        game.apple.y = null;
        game.points += 1;
        game.banner.innerText = "You raised " + game.points + " points!";
        snake.length++;
    }
}

function fullPosition(){
    if (checkGameOver()){
        gameOver();
        return;
    }
    eatApple();
    if(game.apple.x === null && game.apple.y === null) generateApple();
    if(game.points === game.boardWidth * game.boardHeight) gameOver();

    snake.headCell.direction = game.cacheDirection;
    snake.headCell.direction = game.cacheDirection;

    snake.snakeArray.unshift({...snake.headCell});
    if(snake.snakeArray.length > snake.length){
        snake.snakeArray.pop();
    }
}

function isPlaceFree(x, y){
    return !(snake.snakeArray.some(element =>
        element.x === x && element.y === y
    ));
}

function generateApple(){
    let x = Math.floor(Math.random()* game.boardWidth) * 20;
    let y = Math.floor(Math.random()* game.boardHeight) * 20;

    if(isPlaceFree(x, y)){
        game.apple.x = x;
        game.apple.y = y;
    } else {
        generateApple();
    }
}

function gameLoop() {
    if (game.gameOver) return;
    let step = 2;
    if (snake.headCell.x % 20 === 0 && snake.headCell.y % 20 === 0){
        fullPosition();
        animate(step);
    }
    else animate(step);
}

async function keyListener(e) {
    if (!game.gameInitiated) {
        game.banner.innerText = "You raised " + game.points + " points!";
        game.gameInitiated = true;
        window.setInterval(gameLoop, 10);
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