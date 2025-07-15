let canvas;
let context;

let request_id;

let fpsInterval = 1000 / 30;
let now;
let then = Date.now();

let zombies = [];

let zombiesRightImage = new Image();
let zombiesLeftImage = new Image();

let player = {
    x: 425,
    y: 275,
    width: 128,
    height: 128,
    frameX: 0,
    frameY: 0,
    xChange: 0,
    yChange: 0,
    tx : 49,
    ty : 80,
    twidth : 32,
    theight : 48
};

let facingDirection = "right";

let playerRightImage = new Image();
let playerLeftImage = new Image();

let bullets = []

let xhttp;
let score = 0;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

document.addEventListener("DOMContentLoaded", init, false)

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    // document.getElementById("name").disabled = true;
    // document.getElementById("submitButton").disabled = true;
    // document.getElementById("nameForm").addEventListener("submit", function(event) {event.preventDefault();
    // send_data()});

    load_assets([
        { "var": playerRightImage, "url": "static/Run_right.png" },
        { "var": playerLeftImage, "url": "static/Run_left.png" },
        { "var": zombiesRightImage, "url": "static/Walk_right.png" },
        { "var": zombiesLeftImage, "url": "static/Walk_left.png" }
    ], draw);

    let replayButton = document.getElementById("button");
    replayButton.style.visibility = "hidden"
    replayButton.addEventListener("click", function () {
    location.reload()
    });

    // draw();
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval)

    if (zombies.length < 10) {
        let side = randint(1, 4);
        let z;
        if (side === 1) {
            z = {
                x: 0,
                y: randint(0, canvas.height),
                size: 15,
                xChange: 3,
                yChange: 3
            };
        } else if (side === 2) {
            z = {
                x: randint(0, canvas.width),
                y: 0,
                size: 15,
                xChange: 3,
                yChange: 3
            };
        } else if (side === 3) {
            z = {
                x: canvas.width,
                y: randint(0, canvas.height),
                size: 15,
                xChange: 3,
                yChange: 3
            };
        } else {
            z = {
                x: randint(0, canvas.width),
                y: canvas.height,
                size: 15,
                xChange: 3,
                yChange: 3
            };
        }
        z.width = 96;
        z.height = 96;
        z.twidth = 32;
        z.theight = 64;
        z.tx = 33;
        z.ty = 33;
        z.frameX = 1;
        z.frameY = 1;
        zombies.push(z);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let z of zombies) {
        // context.fillStyle = "green";
        // context.fillRect(z.x, z.y, z.size, z.size);

        // console.log(1)
        let dx = player.x - z.x;
        let dy = player.y - z.y;
        let approachSpeed = randint(1,3);
        if (dx > approachSpeed) {
            dx = approachSpeed;
        }
        if (dx < -approachSpeed) {
            dx = -approachSpeed;
        }
        if (dy > approachSpeed) {
            dy = approachSpeed;
        }
        if (dy < -approachSpeed) {
            dy = -approachSpeed;
        }
        z.x += dx;
        z.y += dy;

        if (dx >= 0) {
            context.drawImage(zombiesRightImage,
                0, 0, z.width, z.height,
                z.x, z.y, z.width, z.height);
            (zombies.frameX + 1) % 8;
        } else {
            context.drawImage(zombiesLeftImage,
                0, 0, z.width, z.height,
                z.x, z.y, z.width, z.height);
            (zombies.frameX + 1) % 8;
            }
        
        if (z.x < 0) {
            z.x = 0;
        } else if (z.x + z.size > canvas.width) {
            z.x = canvas.width - z.size;
        }
        if (z.y < 0) {
            z.y = 0;
        } else if (z.y + z.size > canvas.height) {
            z.y = canvas.height - z.size;
        }
    }

    // context.fillStyle = "red"
    // context.fillRect(player.x, player.y, player.size, player.size)

    //context.clearRect(0, 0, canvas.width, canvas.height)
    if (facingDirection === "right") {
        context.drawImage(playerRightImage,
            player.frameX * player.width, player.frameY * player.height, player.width, player.height,
            player.x, player.y, player.width, player.height)
    } else {
        context.drawImage(playerLeftImage,
            player.frameX * player.width, player.frameY * player.height, player.width, player.height,
            player.x, player.y, player.width, player.height)
    }

    // context.drawImage(playerImage,
    //     player.frameX * player.width, player.frameY * player.height, player.width, player.height,
    //     player.x, player.y, player.width, player.height)

    if ((moveLeft || moveRight) &&
        !(moveLeft && moveRight)) {
        player.frameX = (player.frameX + 1) % 8
    }

    for (let z of zombies) {
        if (player_collides(z)) {
            stop("You Lose!");
            //return;
        }
    }

    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, canvas.width - 100, 30);

    if (player.y + player.size > canvas.size) {
        player.y = canvas.size - player.size;
        //moveDown = false;
    } else if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
        //moveRight = false;
    } else if (player.x < 0) {
        player.x = 0;
        //moveLeft = false;
    } else if (player.y < 0) {
        player.y = 0;
        //moveUp = false;
    }
    for (let z of zombies) {
        if (z.y + z.height > canvas.height) {
            z.y = canvas.height - z.height;
        } else if (z.x + z.width > canvas.width) {
            z.x = canvas.width - z.width;
        } else if (z.x < 0) {
            z.x = 0;
        } else if (z.y < 0) {
            z.y = 0;
        }
    }

    if (moveRight) {
        player.x += 4;
        player.tx += player.xChange
        //player.frameY = 2;
    }
    if (moveUp) {
        player.y -= 4;
        player.ty -= player.yChange
        //player.frameY = 2;
    }
    if (moveDown) {
        player.y += 4;
        player.ty += player.yChange
        //player.frameY = 1;
    }
    if (moveLeft) {
        player.x -= 4;
        player.tx -= player.xChange
        //player.frameY = 1;
    }

    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;

    // Draw bullets
    for (let bullet of bullets) {
        context.fillStyle = bullet.color;
        context.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
        bullet.x += bullet.xChange;
        bullet.y += bullet.yChange;
    }

    // Check bullet-zombie collisions
    for (let i = 0; i < zombies.length; i++) {
        for (let bullet of bullets) {
            if (bullet_collides(bullet, zombies[i])) {
                bullets.splice(bullets.indexOf(bullet), 1);
                zombies.splice(i, 1);
                score++;
                break;
            }
        }
    }

    if (bullets.x + bullets.size < 0 || bullets.x > canvas.width || bullets.y + bullets.size < 0 || bullets.y > canvas.height) {
        bullets.splice(bullets.indexOf(bullets), 1);
    }

    for (let bullet of bullets) {
        if (bullet.x + bullet.size > canvas.width) {
            let index = bullet.indexOf(bullet)
            bullet.splice(index, 1)
        }
    }

    // console.log(bullets)
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function activate(event) {
    let key = event.key;
    let key2 = event.code;
    if (key === "ArrowLeft") {
        moveLeft = true;
        facingDirection = "left";
    } else if (key === "ArrowUp") {
        moveUp = true;
        facingDirection = "up";
    } else if (key === "ArrowRight") {
        moveRight = true;
        facingDirection = "right";
    } else if (key === "ArrowDown") {
        moveDown = true;
        facingDirection = "down";
    }
    if (key2 === "Space") {
        shoot()
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    }
}

function shoot() {
    let bullet;
    // console.log(1)
    let xChange, yChange;
    if (facingDirection === "right") {
        xChange = 5;
        yChange = 0;
        bullet = {
            x: player.x + player.twidth + player.tx,
            y: player.y + (player.theight / 2) + player.ty,
            size: 5,
            color: "yellow",
            xChange: 5,
            yChange: 0
        }
    } else if (facingDirection === "left") {
        xChange = -5;
        yChange = 0;
        bullet = {
            x: player.x + player.tx,
            y: player.y + player.theight / 2 + player.ty,
            size: 5,
            color: "yellow",
            xChange: -5,
            yChange: 0
        }
    } else if (facingDirection === "up") {
        xChange = 0;
        yChange = -5;
        bullet = {
            x: player.x + player.twidth / 2 + player.tx,
            y: player.y + player.ty,
            size: 5,
            color: "yellow",
            xChange: 0,
            yChange: -5
        }
    } else if (facingDirection === "down") {
        xChange = 0;
        yChange = 5;
        bullet = {
            x: player.x + player.twidth / 2 + player.tx,
            y: player.y + player.theight + player.ty,
            size: 5,
            color: "yellow",
            xChange: 0,
            yChange: 5
        }
    }
    bullets.push(bullet);
}

function player_collides(z) {
    if (player.x + player.tx + player.twidth < z.tx + z.x ||
        z.tx + z.x + z.twidth < player.tx + player.x ||
        player.ty + player.y > z.ty + z.y + z.theight ||
        z.ty + z.y > player.ty + player.y + player.theight) {
        return false;
    } else {
        return true;
    }
}

// function zombie_collides(bullet) {
//     if (zombie.x + zombie.size < bullet.x ||
//         bullet.x + bullet.size < zombie.x ||
//         zombie.y > bullet.y + bullet.size ||
//         bullet.y > zombie.y + zombie.size) {
//             return false;
//         } else {
//             return true;
//         }
// }

function bullet_collides(bullet, z) {
    if (bullet.x < z.x + z.tx + z.twidth &&
        bullet.x + bullet.size > z.x + z.tx &&
        bullet.y < z.y + z.ty + z.theight &&
        bullet.y + bullet.size > z.y + z.ty) {

        score++;

        bullets.splice(bullets.indexOf(bullet), 1);
        zombies.splice(zombies.indexOf(z), 1);

        return true;
    }
    return false;
}

function stop() {
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);

    context.fillStyle = "Red";
    context.font = "50px Arial";
    context.fillText("Game Over", (canvas.width /2 - 125), (canvas.height / 2));

    let username = prompt("Game Over - Please Enter Your Username");

    let replayButton = document.getElementById("button");
    replayButton.style.visibility = "visible" // found on this link - https://www.w3schools.com/jsref/prop_style_visibility.asp

    send_data(username, score);
}

function send_data(playerName, playerScore) {
    let data = new FormData();
    data.append("score", playerScore);
    data.append("name", playerName);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/add_to_leaderboard", true);
    xhttp.send(data);

    // xhttp = new XMLHttpRequest();
    // xhttp.addEventListener("readystatechange", handle_response, false);
    // xhttp.open("POST", "/store_score", true);
    // xhttp.send(data);
}

function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function () {
        console.log("loaded");
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        element.src = asset.url;
    }
}

function handle_response() {
    // check response has arrive
    if (xhttp.readyState === 4) {
        // check request was successful
        if (xhttp.status === 200) {
            if (xhttp.responseText === "success") {
            // score was stored in database
            console.log("Yes")
            } else {
                // score was not stored in database
                console.log("No");
                console.log(xhttp.status);
            }
        }
    }
}