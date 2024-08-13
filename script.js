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
    ],
    scores: {
        X: 0,
        O: 0,
        ties: 0
    },
    aiPlayer: 'O',
    gameMode: 'pvp' // 'pvp' or 'ai'
};

const statusDisplay = document.querySelector('.status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('.reset-button');
const scoreDisplay = document.querySelector('.score-display');
const gameModeToggle = document.querySelector('.game-mode-toggle');

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState.board[clickedCellIndex] !== '' || !gameState.gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameState.gameMode === 'ai' && gameState.gameActive && gameState.currentPlayer === gameState.aiPlayer) {
        setTimeout(makeAiMove, 500);
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState.board[clickedCellIndex] = gameState.currentPlayer;
    clickedCell.textContent = gameState.currentPlayer;
    addPlacementAnimation(clickedCell);
}

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
        updateScore(gameState.currentPlayer);
        disableCells();
        return;
    }

    const roundDraw = !gameState.board.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Game ended in a draw!';
        gameState.gameActive = false;
        updateScore('ties');
        disableCells();
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
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#fff';
    });
    enableCells();

    if (gameState.gameMode === 'ai' && gameState.currentPlayer === gameState.aiPlayer) {
        setTimeout(makeAiMove, 500);
    }
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        cells[index].style.backgroundColor = '#90EE90';
    });
}

function addPlacementAnimation(cell) {
    cell.style.transform = 'scale(0)';
    setTimeout(() => {
        cell.style.transform = 'scale(1)';
    }, 50);
}

function disableCells() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

function enableCells() {
    cells.forEach(cell => cell.style.pointerEvents = 'auto');
}

function updateScore(winner) {
    gameState.scores[winner]++;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `X: ${gameState.scores.X} | O: ${gameState.scores.O} | Ties: ${gameState.scores.ties}`;
}

function toggleGameMode() {
    gameState.gameMode = gameState.gameMode === 'pvp' ? 'ai' : 'pvp';
    gameModeToggle.textContent = gameState.gameMode === 'pvp' ? 'Switch to AI Mode' : 'Switch to PvP Mode';
    handleRestartGame();
}

function makeAiMove() {
    const emptyCells = gameState.board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMoveIndex = emptyCells[randomIndex];
        const aiCell = cells[aiMoveIndex];

        handleCellPlayed(aiCell, aiMoveIndex);
        handleResultValidation();
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);
gameModeToggle.addEventListener('click', toggleGameMode);

// Initialize score display
updateScoreDisplay();