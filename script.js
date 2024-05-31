document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const grid = 32;
    const rows = 20;
    const cols = 10;
    const tetrominoes = [
        [[1, 1, 1, 1]], // I
        [[1, 1, 0], [0, 1, 1]], // S
        [[0, 1, 1], [1, 1, 0]], // Z
        [[1, 1, 1], [0, 1, 0]], // T
        [[1, 1], [1, 1]] // O
    ];
    const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

    let tetromino = [];
    let tetrominoX = 0;
    let tetrominoY = 0;
    let tetrominoColor;
    let score = 0;
    let level = 1;
    let gridArray = [];
    let dropInterval = 1000;
    let lastTime = 0;

    function createGrid() {
        for (let row = 0; row < rows; row++) {
            gridArray[row] = [];
            for (let col = 0; col < cols; col++) {
                gridArray[row][col] = 0;
            }
        }
    }

    function getRandomTetromino() {
        const index = Math.floor(Math.random() * tetrominoes.length);
        tetrominoColor = colors[Math.floor(Math.random() * colors.length)];
        return tetrominoes[index];
    }

    function drawTetromino() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        context.fillStyle = tetrominoColor;
        for (let y = 0; y < tetromino.length; y++) {
            for (let x = 0; x < tetromino[y].length; x++) {
                if (tetromino[y][x]) {
                    context.fillRect((tetrominoX + x) * grid, (tetrominoY + y) * grid, grid, grid);
                }
            }
        }
    }

    function drawGrid() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (gridArray[row][col]) {
                    context.fillStyle = gridArray[row][col];
                    context.fillRect(col * grid, row * grid, grid, grid);
                }
            }
        }
    }

    function collide() {
        for (let y = 0; y < tetromino.length; y++) {
            for (let x = 0; x < tetromino[y].length; x++) {
                if (tetromino[y][x] && 
                    (tetrominoY + y >= rows || 
                     tetrominoX + x < 0 || 
                     tetrominoX + x >= cols || 
                     gridArray[tetrominoY + y][tetrominoX + x])) {
                    return true;
                }
            }
        }
        return false;
    }

    function rotateTetromino() {
        const newTetromino = [];
        for (let y = 0; y < tetromino[0].length; y++) {
            newTetromino[y] = [];
            for (let x = 0; x < tetromino.length; x++) {
                newTetromino[y][x] = tetromino[tetromino.length - 1 - x][y];
            }
        }
        return newTetromino;
    }

    function handleKey(e) {
        if (e.key === 'ArrowLeft') {
            tetrominoX--;
            if (collide()) {
                tetrominoX++;
            }
        } else if (e.key === 'ArrowRight') {
            tetrominoX++;
            if (collide()) {
                tetrominoX--;
            }
        } else if (e.key === 'ArrowDown') {
            tetrominoY++;
            if (collide()) {
                tetrominoY--;
                mergeTetromino();
                checkLines();
                resetTetromino();
            }
        } else if (e.key === 'ArrowUp') {
            const rotated = rotateTetromino();
            const oldTetromino = tetromino;
            tetromino = rotated;
            if (collide()) {
                tetromino = oldTetromino;
            }
        }
        drawTetromino();
    }

    function mergeTetromino() {
        for (let y = 0; y < tetromino.length; y++) {
            for (let x = 0; x < tetromino[y].length; x++) {
                if (tetromino[y][x]) {
                    gridArray[tetrominoY + y][tetrominoX + x] = tetrominoColor;
                }
            }
        }
    }

    function checkLines() {
        for (let row = rows - 1; row >= 0; row--) {
            let fullRow = true;
            for (let col = 0; col < cols; col++) {
                if (!gridArray[row][col]) {
                    fullRow = false;
                    break;
                }
            }
            if (fullRow) {
                gridArray.splice(row, 1);
                gridArray.unshift(new Array(cols).fill(0));
                score += 10;
                document.getElementById('score').innerText = `Score: ${score}`;
                level = Math.floor(score / 50) + 1;
                document.getElementById('level').innerText = `Level: ${level}`;
                dropInterval = 1000 - (level - 1) * 100;
                if (dropInterval < 100) {
                    dropInterval = 100;
                }
            }
        }
    }

    function resetTetromino() {
        tetromino = getRandomTetromino();
        tetrominoX = 3;
        tetrominoY = 0;
        if (collide()) {
            alert('Game Over');
            createGrid();
            score = 0;
            level = 1;
            dropInterval = 1000;
            document.getElementById('score').innerText = `Score: ${score}`;
            document.getElementById('level').innerText = `Level: ${level}`;
        }
    }

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            tetrominoY++;
            if (collide()) {
                tetrominoY--;
                mergeTetromino();
                checkLines();
                resetTetromino();
            }
            dropCounter = 0;
        }
        drawTetromino();
        requestAnimationFrame(update);
    }

    function init() {
        document.addEventListener('keydown', handleKey);
        createGrid();
        resetTetromino();
        update();
    }

    init();
});
