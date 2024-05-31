document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const grid = 32;
    const rows = 20;
    const cols = 10;
    const tetrominoes = [
        [[1, 1, 1, 1]],  // I
        [[1, 1, 0], [0, 1, 1]],  // S
        [[0, 1, 1], [1, 1, 0]],  // Z
        [[1, 1, 1], [0, 1, 0]],  // T
        [[1, 1], [1, 1]]  // O
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
    let dropCounter = 0;

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
        for (
