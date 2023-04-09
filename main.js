let canvas;
let ctx;
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas);

let backgroundImage,
    spaceshipImage,
    bulletImage,
    enemyImage,
    gameoverImage,
    heart;
let gameOver = false; //true : 게임 끝 / false : 게임 지속
let score = 0;

//우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

let heartList = [];
class Heart {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.alive = true;
    }
    init(num) {
        this.x = canvas.width - 50 - num;
        this.y = 10;
        this.alive = true;
        heartList.push(this);
    }
    deleteHeart(i) {
        heartList.splice(i, 1);
    }
}

let bulletList = []; //총알들을 저장하는 리스트
/*function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = spaceshipX + 20;
        this.y = spaceshipY;

        bulletList.push(this);
    };
    this.update = function () {
        this.y -= 7;
    };
}*/
class Bullet {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.alive = true;
    }
    init() {
        this.x = spaceshipX + 20;
        this.y = spaceshipY;
        this.alive = true; //살아있는 총알, false는 죽은 총알
        bulletList.push(this);
    }
    update() {
        if (this.y <= 0) {
            this.alive = false;
        }
        this.y -= 7;
    }
    checkHit() {
        for (let i = 0; i < enemyList.length; i++) {
            if (
                this.y <= enemyList[i].y &&
                this.x >= enemyList[i].x &&
                this.x <= enemyList[i].x + 40
            ) {
                score++;
                this.alive = false;
                enemyList.splice(i, 1);
            }
        }
    }
}

let enemyList = [];
class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    init() {
        this.x = generateRandomValue(0, canvas.width - 48);
        this.y = 0;
        enemyList.push(this);
    }
    update() {
        this.y += 2; //적군의 속도 조절

        if (this.y >= canvas.height - 48) {
            gameOver = true;
        }
        /*if (this.x === spaceshipX || this.y === spaceshipY) {
            gameOver = true;
        }*/
    }
}

function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = 'image/background.gif';

    spaceshipImage = new Image();
    spaceshipImage.src = 'image/spaceship.png';

    bulletImage = new Image();
    bulletImage.src = 'image/bullet.png';

    enemyImage = new Image();
    enemyImage.src = 'image/enemy.png';

    gameoverImage = new Image();
    gameoverImage.src = 'image/gameover.jpg';

    heart = new Image();
    heart.src = 'image/heart.png';
}

let keysDown = {};
function setupKeyboardListener() {
    document.addEventListener('keydown', function (event) {
        keysDown[event.keyCode] = true;
    });
    document.addEventListener('keyup', function (event) {
        delete keysDown[event.keyCode];

        if (event.keyCode === 32) {
            createBullet(); //총알 생성
        }
    });
}

function createHeart() {
    let num = 50;
    for (let i = 0; i < 3; i++) {
        let h = new Heart();
        h.init(num * i);
    }
}

function createBullet() {
    let b = new Bullet(); //총알 하나 생성
    b.init(); //좌표 업데이트
}

function createEnemy() {
    const interval = setInterval(function () {
        //1초마다 적 하나 생성
        let e = new Enemy();
        e.init();
    }, 1000);
}

function update() {
    if (39 in keysDown) {
        //rigth
        spaceshipX += 5; //우주선의 속도
    }
    if (37 in keysDown) {
        //left
        spaceshipX -= 5;
    }
    if (38 in keysDown) {
        spaceshipY -= 4;
    }
    if (40 in keysDown) {
        spaceshipY += 4;
    }
    if (spaceshipX <= 0) {
        spaceshipX = 0;
    }
    if (spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width - 64;
    }

    //총알의 y좌표 없데이트하기
    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    //적의 y좌표 업데이트
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    ctx.fillText(`Sroce : ${score}`, 20, 25);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';

    for (let i = 0; i < heartList.length; i++) {
        if (heartList[i].alive) {
            ctx.drawImage(heart, heartList[i].x, heartList[i].y);
        }
    }

    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for (let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

function main() {
    if (!gameOver) {
        update(); //좌표값을 업데이트하고
        render(); //그려주고
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverImage, 10, 100, 380, 380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
createHeart();
main();

//총알 만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사 = 총알의 y값이 --, 총알의 x값은? 스페이스를 누른 우주선의 x좌표
//3. 발사된 총알들은 총알 배열에 저장을 한다.
//4. 총알들은 x, y좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render로 그려준다.

//적군 만들기
//1. 적군은 위치가 랜덤하다
//2. 적군은 밑으로 점점 내려온다
//3. 적군은 1초마다 등장하게 된다
//4. 적군의 우주선이 바닥에 닿으면 게임오버
//5. 적군과 총알이 만나면 우주선이 사라진다. 점수 1점 획득
//총알.y <= 적군.y and
//총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이
//-> 닿았다.

//담에 할거 -> 생명 사라지게 하기
