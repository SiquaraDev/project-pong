// canvas context
let ctx;

// player variables
let p1_key, p2_key, p1_y, p2_y, p1_points, p2_points;

// ball variables
let ball_y_orientation, ball_x_orientation, ball_x, ball_y;

const H=500, W=900, P_W=10, P_H=60, P1_X = 10, P2_X = W - P_W - 10, P1_COLOR = "blue", P2_COLOR = "orange";

function setup() {
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    setPlayersMiddleWindow();
    
    // set scoreboard to 0x0
    p1_points = 0;
    p2_points = 0;

    // 60fps interval
    setInterval(loop,1000/60);

    initBall();
}

function loop() {
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
        
    // ball speed
    ball_x += 5 * ball_x_orientation;
    ball_y += 4 * ball_y_orientation;

    if (ball_x + 10 > W) {
        p1_points++;
        ResetAllPos();
    } else if (ball_x < 0) {
        p2_points ++;
        ResetAllPos();
    }

    // move p1
    if (p1_key == "w" && p1_y > 0) {
        p1_y -= 5;
    } else if (p1_key == "s" && p1_y + P_H < H) {
        p1_y += 5;
    }

    // move p2
    if (p2_key == "ArrowUp" && p2_y > 0) {
        p2_y -= 5;
    } else if (p2_key == "ArrowDown" && p2_y + P_H < H) {
        p2_y += 5;
    }

    draw();
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

function initBall() {
    // random direction
    ball_y_orientation = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3;
    ball_x_orientation = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3;

    // set ball in the middle of the window
    ball_x = W / 2 - 10;
    ball_y = H / 2 - 10;
}

function setPlayersMiddleWindow() {
    p1_y = p2_y = (H / 2) - (P_H/2);
}

function setPlayersKeyNull() {
    p1_key = p2_key = null;
}

function ResetAllPos() {
    setPlayersMiddleWindow();
    setPlayersKeyNull();
    initBall();
}

document.addEventListener("keydown",function(ev) {
    if (ev.key.toLowerCase() == "w" || ev.key.toLowerCase() == "s") {
        p1_key = ev.key.toLowerCase();
    } else if (ev.key == "ArrowUp" || ev.key == "ArrowDown") {
        p2_key = ev.key;
    }
})

setup();