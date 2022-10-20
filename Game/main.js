//TODO: Implement levels 






// select game screens
const gameStart = document.getElementById(`start`);
const newGame = document.getElementById(`new-game`);
const gameArea = document.getElementById(`game-area`);
const gameOver = document.getElementById(`game-over`);
const gameOverSakura = document.getElementById(`wtf`);
const gameScore = document.getElementById(`game-score`);
const gamePoints = document.getElementById(`points`);
const gameLives = document.getElementById(`lives`);

let naruto = document.getElementById(`naruto`);
let sasuke = document.getElementById(`sasuke`);
let sakura = document.getElementById(`sakura`);
let selected = ``;

naruto.addEventListener(`click`, () => {
    naruto.classList.add(`selected`);
    sasuke.classList.remove(`selected`);
    sakura.classList.remove(`selected`);
    selected = `naruto`;
});
sasuke.addEventListener(`click`, () => {
    naruto.classList.remove(`selected`);
    sasuke.classList.add(`selected`);
    sakura.classList.remove(`selected`);
    selected = `sasuke`;
});
sakura.addEventListener(`click`, () => {
    naruto.classList.remove(`selected`);
    sasuke.classList.remove(`selected`);
    sakura.classList.add(`selected`);
    selected = `sakura`;
});

//game start listener
gameStart.addEventListener(`click`, onGameStart);

newGame.addEventListener(`click`, newGameFunc);

function newGameFunc() {
    location.reload();
}

//global key listeners
document.addEventListener(`keydown`, onKeyDown);
document.addEventListener('keyup', onKeyUp);

let keys = {};

let player = {
    x: 150,
    y: 100,
    width: 0,
    height: 0,
    lastTimeAttack: 0
};

let game = {
    speed: 2,
    movingMultiplier: 4,
    attackMultiplier: 5,
    enemyMultiplier: 1.2,
    fireInterval: 800,
    convertInterval: 200,
    cloudSpawnInterval: 3000,
    enemySpawnInterval: 3000,
    enemyKillBonus: 50
};

let scene = {
    score: 0,
    lives: 3,
    lastCloudSpawn: 0,
    lastEnemySpawn: 0,
    isActiveGame: true
}


// key handlers
function onKeyDown(event) {
    keys[event.code] = true;
    // console.log(keys);
}
function onKeyUp(event) {
    keys[event.code] = false;
    // console.log(keys);
}

function renderCharacter(character) {
    if (selected === `naruto`) {
        character.classList.add(`character-naruto`);
        character.style.top = `200px`;
        character.style.left = `200px`;
        gameArea.appendChild(character);
    }
    else if (selected === `sasuke`) {
        character.classList.add(`character-sasuke`);
        character.style.top = `200px`;
        character.style.left = `200px`;
        gameArea.appendChild(character);
    }
}

// Game start function
function onGameStart() {
    if (selected === `sakura`) {
        gameOverSakura.classList.remove(`hide`);
        gameStart.parentElement.classList.add(`hide`);
        gameArea.classList.add(`hide`);

        let newGame = document.getElementById(`new-game-sakura`)

        newGame.addEventListener(`click`, newGameFunc);
    }
    if (selected !== ``) {
        gameStart.parentElement.classList.add(`hide`);

        //render character
        const character = document.createElement(`div`);
        renderCharacter(character);

        player.width = character.offsetWidth;
        player.height = character.offsetHeight;

        // game infinite loop
        window.requestAnimationFrame(gameAction);
    }
}

let counter = 0;
let isPlayerAttacked = false;

// Game Over
function gameOverAction() {
    scene.isActiveGame = false;
    gameOver.classList.remove(`hide`);
    gameStart.parentElement.classList.add(`hide`);
    gameArea.classList.add(`hide`);
}
// Game loop function
function gameAction(timestamp) {
    let character = {};
    if (selected === `naruto`) {
        character = document.querySelector(`.character-naruto`);
    }
    else {
        character = document.querySelector(`.character-sasuke`);
    }

    counter++;

    // Add enemies
    if (timestamp - scene.lastEnemySpawn > game.enemySpawnInterval + 5000 * Math.random()) {
        let enemy = document.createElement(`div`);
        enemy.classList.add(`enemy`);
        enemy.x = gameArea.offsetWidth - 100;
        enemy.style.left = enemy.x + `px`;
        enemy.style.top = (gameArea.offsetHeight - 100) * Math.random() + `px`;
        gameArea.appendChild(enemy);
        scene.lastEnemySpawn = timestamp;
    };

    // Modify enemy position
    let enemies = document.querySelectorAll(`.enemy`);
    enemies.forEach(enemy => {
        enemy.x -= game.speed * game.enemyMultiplier;
        enemy.style.left = enemy.x + `px`;

        if (enemy.x + enemy.offsetWidth <= 0) {
            enemy.parentElement.removeChild(enemy);
            scene.lives--;

            if (gameLives.children.length > scene.lives) {
                let img = gameLives.children[0];

                gameLives.removeChild(img);
            }
            if (scene.lives === 0) {
                gameLives.innerHTML = `<img class="live" src="./images/dead.png" alt="X">`;
                gameOverAction();
            }
        }
    });

    // Add clouds
    if (timestamp - scene.lastCloudSpawn > game.cloudSpawnInterval + 2000 * Math.random()) {
        let cloud = document.createElement(`div`);
        cloud.classList.add(`cloud`);
        cloud.x = gameArea.offsetWidth - 200;
        cloud.style.left = cloud.x + `px`;
        cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + `px`;
        gameArea.appendChild(cloud);
        scene.lastCloudSpawn = timestamp;
    };

    // Modify cloud position
    let clouds = document.querySelectorAll(`.cloud`);
    clouds.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + `px`;

        if (cloud.x + clouds.offsetWidth <= 0) {
            cloud.parentElement.removeChild(cloud);
        }
    });

    // Define Attack
    function attack(player) {
        let attack = document.createElement(`div`);

        if (selected === `naruto`) {
            attack.classList.add(`attack-naruto`);
        }
        else {
            attack.classList.add(`attack-sasuke`);
        }
        attack.style.top = (player.y + player.height / 3 - 5) + `px`;
        attack.x = player.x + player.width;
        attack.style.left = attack.x + `px`;
        gameArea.appendChild(attack);
    }

    // Modify attack position
    let attacks = document.querySelectorAll(`.attack`);
    if (selected === `naruto`) {
        attacks = document.querySelectorAll(`.attack-naruto`);
    }
    else {
        attacks = document.querySelectorAll(`.attack-sasuke`);
    }
    attacks.forEach(attack => {
        attack.x += game.speed * game.attackMultiplier;
        attack.style.left = attack.x + `px`;

        if (attack.x + attack.offsetWidth > gameArea.offsetWidth) {
            attack.parentElement.removeChild(attack);
        }
    });

    // Apply gravitation
    let isInAir = (player.y + player.height) <= gameArea.offsetHeight;

    if (isInAir) {
        player.y += game.speed;
    }

    // Register user input
    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingMultiplier;
    }
    if (keys.ArrowDown && isInAir) {
        player.y += game.speed * game.movingMultiplier;
    }
    if (keys.ArrowLeft & player.x > 0) {
        player.x -= game.speed * game.movingMultiplier;
    }
    if (keys.ArrowRight && player.x + player.width < gameArea.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
    }
    if (keys.Space && timestamp - player.lastTimeAttack > game.fireInterval) {
        if (selected === `naruto`) {
            character.classList.add(`naruto-fire`);
        }
        else {
            character.classList.add(`sasuke-fire`);
        }
        isPlayerAttacked = true;
        player.lastTimeAttack = timestamp;
        player.lastTimeConvert = timestamp;

        isCollision(character, character);
    }
    else if (timestamp - player.lastTimeAttack > game.convertInterval) {
        if (selected === `naruto`) {
            character.classList.remove(`naruto-fire`);
        }
        else {
            character.classList.remove(`sasuke-fire`);
        }
        if (isPlayerAttacked) {
            attack(player);
            isPlayerAttacked = false;
        }

    }



    // Apply movement
    character.style.top = player.y + `px`;
    character.style.left = player.x + `px`;

    // Apply score
    if (counter % 50 == 0) {
        counter = 0;
        scene.score++;
        gamePoints.textContent = scene.score;
    }

    // Collision detection
    enemies.forEach(enemy => {
        if (isCollision(character, enemy)) {
            gameOverAction();
        };

        attacks.forEach(attack => {
            if (isCollision(attack, enemy)) {
                scene.score += game.enemyKillBonus;
                enemy.parentElement.removeChild(enemy);
                attack.parentElement.removeChild(attack);
            }
        });
    })

    if (scene.isActiveGame) {
        window.requestAnimationFrame(gameAction);
    }
}

// Add Collision
function isCollision(firstElement, secondElement) {
    let firstRect = firstElement.getBoundingClientRect();
    let secondRect = secondElement.getBoundingClientRect();

    return !(firstRect.top > secondRect.bottom
        || firstRect.bottom < secondRect.top
        || firstRect.right < secondRect.left
        || firstRect.left > secondRect.right);
}