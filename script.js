        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let x = 50;
        let y = 50;
        let vx = 0;
        let vy = 0;
        let score = 0;
        let highScore = localStorage.getItem("highScore123") || 0;
        let collision = false;
        let frameCount = 0;
        let startTime = Date.now();
        let laser = false;
        let characterLife = 5;
        let hitCount = 0;
        let stickmanShots = [];
        let characterShots = [];
        let characterDirection = 'right';
        let shootDirection = 'right';

        document.getElementById('highScoreBoard').textContent = "High Score: " + highScore;

        const obstacles = [];
        for (let i = 0; i < 10; i++) {
            obstacles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 20,
                height: 50,
                shot: false
            });
        }

        function drawCharacter(x, y) {
            const scale = 1.0;
            y -= 30;

            ctx.fillStyle = '#ffd295';
            ctx.fillRect(x, y, 20 * scale, 20 * scale);

            ctx.fillStyle = 'black';
            ctx.fillRect(x + 10 * scale, y + 10 * scale, 4 * scale, 4 * scale);
            ctx.fillRect(x + 16 * scale, y + 10 * scale, 4 * scale, 4 * scale);

            ctx.fillRect(x + 8 * scale, y + 15 * scale, 12 * scale, 3 * scale);

            ctx.fillRect(x + 16 * scale, y + 5 * scale, 4 * scale, 2 * scale);
            ctx.fillRect(x + 10 * scale, y + 5 * scale, 4 * scale, 2 * scale);

            ctx.fillStyle = '#363636';
            ctx.fillRect(x, y, 20 * scale, 4 * scale);
            ctx.fillRect(x + 2 * scale, y + 4 * scale, 6 * scale, 8 * scale);
            ctx.fillRect(x, y, 3.2 * scale, 16 * scale);

            ctx.fillStyle = '#8c7452';
            ctx.fillRect(x + 2 * scale, y + 10.4 * scale, 3.2 * scale, 4 * scale);

            ctx.fillStyle = 'white';
            ctx.fillRect(x + 12 * scale, y + 12 * scale, 1.2 * scale, 1.2 * scale);
            ctx.fillRect(x + 17.6 * scale, y + 12 * scale, 1.2 * scale, 1.2 * scale);

            ctx.fillRect(x + 10 * scale, y + 15.6 * scale, 8 * scale, 1.2 * scale);
            ctx.fillStyle = 'pink';
            ctx.fillRect(x + 12 * scale, y + 17.2 * scale, 4 * scale, 1.2 * scale);

            ctx.fillStyle = '#80eaff';
            ctx.fillRect(x + 4 * scale, y + 20 * scale, 12 * scale, 16 * scale);

            ctx.fillStyle = '#0096ff';
            ctx.fillRect(x + 4 * scale, y + 36 * scale, 4 * scale, 16 * scale);
            ctx.fillRect(x + 12 * scale, y + 36 * scale, 4 * scale, 16 * scale);

            ctx.fillStyle = 'black';
            ctx.fillRect(x + 16 * scale, y + 20.8 * scale, 4 * scale, 14 * scale);
            ctx.fillRect(x + 0.8 * scale, y + 20.8 * scale, 4 * scale, 14 * scale);

            ctx.fillRect(x + 4 * scale, y + 50 * scale, 5.2 * scale, 2.4 * scale);
            ctx.fillRect(x + 12 * scale, y + 50 * scale, 5.2 * scale, 2.4 * scale);
        }

        function drawStickman(x, y, shot) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Head
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 18);
    ctx.lineTo(x + 10, y + 35);
    ctx.stroke();

// Left Arm
ctx.beginPath();
ctx.moveTo(x + 10, y + 22);
ctx.lineTo(x + 4, y + 30);
ctx.stroke();

// Right Arm
ctx.beginPath();
ctx.moveTo(x + 10, y + 22);
ctx.lineTo(x + 16, y + 30);
ctx.stroke();

// Left Leg
ctx.beginPath();
ctx.moveTo(x + 10, y + 35);
ctx.lineTo(x + 4, y + 45);
ctx.stroke();

// Right Leg
ctx.beginPath();
ctx.moveTo(x + 10, y + 35);
ctx.lineTo(x + 16, y + 45);
ctx.stroke();

            if (shot) {
                ctx.fillStyle = 'red';
                ctx.fillRect(x + 8, y + 8, 4, 4);
            }
        }

        function drawShot(shot) {
            ctx.fillStyle = 'red';
            ctx.fillRect(shot.x, shot.y, 5, 5);
        }

        function moveStickmen() {
            obstacles.forEach(obstacle => {
                if (!obstacle.shot) {
                    let dx = x - obstacle.x;
                    let dy = y - obstacle.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    let moveX = (dx / distance) * 1;
                    let moveY = (dy / distance) * 1;

                    obstacle.x = Math.min(Math.max(obstacle.x + moveX, 0), canvas.width - obstacle.width);
                    obstacle.y = Math.min(Math.max(obstacle.y + moveY, 0), canvas.height - obstacle.height);
                }
            });
        }

        function moveCharacterShots() {
    characterShots.forEach(shot => {
        switch (shot.direction) {
            case 'left':
                shot.x -= 5;
                break;
            case 'right':
                shot.x += 5;
                break;
            case 'up':
                shot.y -= 5;
                break;
            case 'down':
                shot.y += 5;
                break;
        }
    });
    // Remove shots that are out of bounds
    characterShots = characterShots.filter(shot => shot.x >= 0 && shot.x <= canvas.width && shot.y >= 0 && shot.y <= canvas.height);
}

        function moveStickmanShots() {
            stickmanShots.forEach(shot => {
                shot.x += shot.vx;
                shot.y += shot.vy;
            });
            stickmanShots = stickmanShots.filter(shot => shot.x >= 0 && shot.x <= canvas.width && shot.y >= 0 && shot.y <= canvas.height);
        }

        function drawShots() {
            characterShots.forEach(drawShot);
            stickmanShots.forEach(drawShot);
        }

        function checkCollisions() {
            characterShots.forEach((shot, shotIndex) => {
                obstacles.forEach((obstacle, obstacleIndex) => {
                    if (!obstacle.shot && shot.x < obstacle.x + obstacle.width && shot.x + 5 > obstacle.x &&
                        shot.y < obstacle.y + obstacle.height && shot.y + 5 > obstacle.y) {
                        obstacle.shot = true;
                        characterShots.splice(shotIndex, 1);
                        score += 10;
                        document.getElementById('scoreBoard').textContent = "Score: " + score;
                    }
                });
            });

            stickmanShots.forEach((shot, shotIndex) => {
                if (shot.x < x + 20 && shot.x + 5 > x && shot.y < y + 50 && shot.y + 5 > y) {
                    characterLife--;
                    stickmanShots.splice(shotIndex, 1);
                    if (characterLife <= 0) {
                        collision = true;
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem("highScore123", highScore);
                            document.getElementById('highScoreBoard').textContent = "High Score: " + highScore;
                        }
                        document.getElementById('restartBtn').style.display = 'block';
                    }
                }
            });
        }

        function updateCharacterPosition() {
            x += vx;
            y += vy;
            x = Math.max(0, Math.min(canvas.width - 20, x));  // Ensure character stays within canvas bounds
            y = Math.max(0, Math.min(canvas.height - 50, y)); // Ensure character stays within canvas bounds
        }

        function update() {
            updateCharacterPosition();
            moveCharacterShots();
            moveStickmen();
            moveStickmanShots();
            checkCollisions();
            spawnStickmen();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCharacter(x, y);
            obstacles.forEach(obstacle => drawStickman(obstacle.x, obstacle.y, obstacle.shot));
            drawShots();
        }

        function gameLoop() {
            if (!collision) {
                update();
                draw();
                requestAnimationFrame(gameLoop);
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = '48px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
                ctx.font = '24px sans-serif';
                ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 50);
                ctx.fillText('High Score: ' + highScore, canvas.width / 2, canvas.height / 2 + 80);
            }
        }

        gameLoop();

        let touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchMoveX, touchMoveY;
        let shooting = false;

        document.getElementById('controlGear').addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            vx = vy = 0;
        });

        document.getElementById('controlGear').addEventListener('touchmove', (e) => {
            touchCurrentX = e.touches[0].clientX;
            touchCurrentY = e.touches[0].clientY;
            touchMoveX = touchCurrentX - touchStartX;
            touchMoveY = touchCurrentY - touchStartY;
            vx = touchMoveX * 0.1;
            vy = touchMoveY * 0.1;
        });

        document.getElementById('controlGear').addEventListener('touchend', () => {
            vx = vy = 0;
});
        document.getElementById('shootGear').addEventListener('touchstart', () => {
            shooting = true;
            characterShots.push({ x: x + 10, y: y + 25, direction: shootDirection });
        });

        document.getElementById('shootGear').addEventListener('touchend', () => {
            shooting = false;
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            collision = false;
            x = 50;
            y = 50;
            score = 0;
            characterLife = 5;
            stickmanShots = [];
            characterShots = [];
            obstacles.forEach(obstacle => obstacle.shot = false);
            document.getElementById('scoreBoard').textContent = "Score: 0";
            document.getElementById('restartBtn').style.display = 'none';
            gameLoop();
        });

        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        setInterval(() => {
    if (!collision && shooting) {
        characterShots.push({ x: x + 10, y: y + 25, direction: shootDirection });
    }
}, 500);

        setInterval(() => {
            if (!collision) {
                obstacles.forEach(obstacle => {
                    if (!obstacle.shot) {
                        let dx = x - obstacle.x;
                        let dy = y - obstacle.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let moveX = (dx / distance) * 2;
                        let moveY = (dy / distance) * 2;

                        stickmanShots.push({
                            x: obstacle.x + 10,
                            y: obstacle.y + 25,
                            vx: moveX * 0.5,
                            vy: moveY * 0.5
                        });
                    }
                });
            }
        }, 1000);

        // Function to spawn stickmen once some die
        function spawnStickmen() {
            if (frameCount % 200 === 0) {
                for (let i = 0; i < 2; i++) {
                    obstacles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        width: 20,
                        height: 50,
                        shot: false
                    });
                }
            }
            frameCount++;
        }