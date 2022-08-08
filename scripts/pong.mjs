// canvas variables
let ctx;
const H=500, W=900; 

// player variables
let p1_key, p2_key, p1_y, p2_y, p1_points, p2_points;
const P_W=10, P_H=60, P1_X = 10, P2_X = W - P_W - 10, P1_COLOR = "blue", P2_COLOR = "orange", P_SPEED = 5;

// ball variables
let ball_y_orientation, ball_x_orientation, ball_x, ball_y;
let ball_in_game = false;


export function setup() {
    const canvas = document.getElementById("canvas-pong");
    ctx = canvas.getContext("2d");
    
    setPlayersMiddleWindowHeight();
    
    // set scoreboard to 0x0
    p1_points = 0;
    p2_points = 0;

    // 60fps interval
    setInterval(loop, 1000/60);

    initBall();
}

function loop() {
    
    draw();    
    
    if (ball_in_game) {
        setBallMoveSpeed(); 
        setPlayersMoveSpeed();
        checkBallColliding();
        checkPoint();
    }
}

function draw() {
    
    // background
    drawRect(0, 0, W, H, "#000");

    // player 1
    drawRect(P1_X, p1_y, P_W, P_H, P1_COLOR);

    // player 2
    drawRect(P2_X, p2_y, P_W, P_H, P2_COLOR);

    // separator
    drawRect((W/2 - 5), 0, 1, H);

    // ball
    drawRect(ball_x, ball_y, 10, 10);

    // scoreboard
    writePoints();

    if (p1_points >= 5 || p2_points >= 5) {
        writeWinner();
    }
}

function drawRect(x, y, w, h, color="#fff"){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#000";
}

function writePoints() {
    ctx.font = "50px monospace";
    ctx.fillStyle = "#fff";

    // w/4 = 1/4 of the window
    ctx.fillText(p1_points, (W/4) - 25, 50);

    // 3*(w/4) = 3/4 of the window
    ctx.fillText(p2_points, 3*(W/4) - 25, 50);
}

function writeWinner() {
    ctx.font = "40px monospace";
    
    if (p1_points > p2_points) {
        ctx.fillStyle = P1_COLOR;
        ctx.fillText("Player 1 winner!", W/2 - 180, H/2 - 20);
    } else {
        ctx.fillStyle = P2_COLOR;
        ctx.fillText("Player 2 winner!", W/2 - 180, H/2 - 20);
    }
}

function initBall() {

    setBallMiddleWindow()

    // random direction
    ball_y_orientation = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3;
    ball_x_orientation = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3; 
}

function checkBallColliding() {

    // change ball orientation if colliding with player 1
    if (ball_x >= P1_X && ball_x <= P1_X + 10 && ball_y >= p1_y && ball_y <= p1_y + P_H) {
        ball_x_orientation = 1;
    }

    //  change ball orientation if colliding with player 2
    else if (ball_x >= P2_X && ball_x <= P2_X + 10 && ball_y >= p2_y && ball_y <= p2_y + P_H) {
        ball_x_orientation = -1;
    }

    // change ball orientation if colliding with ceil or floor
    if(ball_y + 10 >= H || ball_y <= 0) {
        ball_y_orientation *= -1;
    }
}

function setBallMoveSpeed() {
    ball_x += 5 * ball_x_orientation;
    ball_y += 4 * ball_y_orientation;
}

function setPlayersMoveSpeed() {

    if (p1_key == "w" && p1_y > 0) {
        p1_y -= P_SPEED;
    } else if (p1_key == "s" && p1_y + P_H < H) {
        p1_y += P_SPEED;
    }

    if (p2_key == "ArrowUp" && p2_y > 0) {
        p2_y -= P_SPEED;
    } else if (p2_key == "ArrowDown" && p2_y + P_H < H) {
        p2_y += P_SPEED;
    }
}

function checkPoint() {

    if (ball_x + 5 > W) {
        p1_points++;
        ball_in_game = false;
        ResetAllPos();
    } else if (ball_x < 0) {
        p2_points++;
        ball_in_game = false;
        ResetAllPos();
    }
}

function ResetAllPos() {
    setPlayersMiddleWindowHeight();
    setBallMiddleWindow();
    setPlayersKeyNull();
}

function setPlayersMiddleWindowHeight() {
    p1_y = p2_y = (H / 2) - (P_H/2);
}

function setBallMiddleWindow() {
    ball_x = W / 2 - 10;
    ball_y = H / 2 - 10;
}

function setPlayersKeyNull() {
    p1_key = p2_key = null;
}

document.addEventListener("keydown", (ev) => {
    
    if (p1_points < 5 && p2_points < 5) {
        if (ball_in_game) {
            if (ev.key.toLowerCase() == "w" || ev.key.toLowerCase() == "s") {
                p1_key = ev.key.toLowerCase();
            } else if (ev.key == "ArrowUp" || ev.key == "ArrowDown") {
                p2_key = ev.key;
            }
        }
        
        if (ev.key == "Enter" && !ball_in_game) {
            ball_in_game = true;
            initBall();
        }
    }

    if (ev.key.toLowerCase() == "r") {
        p1_points = p2_points = 0;

    }

})