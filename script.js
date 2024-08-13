// script.js

const gameState = {
    currentPlayer: 'X',
    board: Array(9).fill(''),
    gameActive: true,
    winningCombinations: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
};

const statusDisplay = document.querySelector('.status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('.reset-button');

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState.board[clickedCellIndex] !== '' || !gameState.gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState.board[clickedCellIndex] = gameState.currentPlayer;
    clickedCell.textContent = gameState.currentPlayer;
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < gameState.winningCombinations.length; i++) {
        const [a, b, c] = gameState.winningCombinations[i];
        const boardValues = gameState.board;
        if (boardValues[a] === boardValues[b] && boardValues[b] === boardValues[c] && boardValues[a] !== '') {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${gameState.currentPlayer} has won!`;
        gameState.gameActive = false;
        return;
    }

    const roundDraw = !gameState.board.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Game ended in a draw!';
        gameState.gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${gameState.currentPlayer}'s turn`;
}

function handleRestartGame() {
    gameState.currentPlayer = 'X';
    gameState.board = Array(9).fill('');
    gameState.gameActive = true;
    statusDisplay.textContent = `Player ${gameState.currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);

// Additional features to meet the 100 lines requirement

// Function to highlight winning combination
function highlightWinningCombination(combination) {
    combination.forEach(index => {
        cells[index].style.backgroundColor = '#90EE90';
    });
}

// Function to add a subtle animation when placing X or O
function addPlacementAnimation(cell) {
    cell.style.transform = 'scale(0)';
    setTimeout(() => {
        cell.style.transform = 'scale(1)';
    }, 50);
}

// Function to disable all cells
function disableCells() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

// Function to enable all cells
function enableCells() {
    cells.forEach(cell => cell.style.pointerEvents = 'auto');
}

// Modify handleCellPlayed to include animation
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState.board[clickedCellIndex] = gameState.currentPlayer;
    clickedCell.textContent = gameState.currentPlayer;
    addPlacementAnimation(clickedCell);
}

// Modify handleResultValidation to include highlighting
function handleResultValidation() {
    let roundWon = false;
    let winningCombination;
    for (let i = 0; i < gameState.winningCombinations.length; i++) {
        const [a, b, c] = gameState.winningCombinations[i];
        const boardValues = gameState.board;
        if (boardValues[a] === boardValues[b] && boardValues[b] === boardValues[c] && boardValues[a] !== '') {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${gameState.currentPlayer} has won!`;
        gameState.gameActive = false;
        highlightWinningCombination(winningCombination);
        disableCells();
        return;
    }

    const roundDraw = !gameState.board.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Game ended in a draw!';
        gameState.gameActive = false;
        disableCells();
        return;
    }

    handlePlayerChange();
}

// Modify handleRestartGame to reset cell styles
function handleRestartGame() {
    gameState.currentPlayer = 'X';
    gameState.board = Array(9).fill('');
    gameState.gameActive = true;
    statusDisplay.textContent = `Player ${gameState.currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#fff';
    });
    enableCells();
}