let currentPlayer = 'X';
let gameWon = false;
let isTied = false;

let currentScore = {
    X: 0,
    O: 0
}

const banner = document.getElementById('banner');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const spaces = document.getElementsByClassName('space');
const xWins = document.getElementById('X-wins');
const oWins = document.getElementById('O-wins');


const currentGame = [
    [-1, -1, -1]
    ,[-1, -1, -1]
    ,[-1, -1, -1]
];

const gameBoardMapper = {
    'TL' : [0, 0],
    'TC' : [0, 1],
    'TR' : [0, 2],
    'ML' : [1, 0],
    'MC' : [1, 1],
    'MR' : [1, 2],
    'BL' : [2, 0],
    'BC' : [2, 1],
    'BR' : [2, 2],
}

const winningCombinations = [
    // Horizonal wins
    ['TL', 'TC', 'TR'],
    ['ML', 'MC', 'MR'],
    ['BL', 'BC', 'BR'],
    // Vertical wins
    ['TL', 'ML', 'BL'],
    ['TC', 'MC', 'BC'],
    ['TR', 'MR', 'BR'],
    // Diagonal wins
    ['TL', 'MC', 'BR'],
    ['TR', 'MC', 'BL'],
]

// On DOM load, event listeners are added to all game spaces
document.addEventListener("DOMContentLoaded", function(event) { 
    currentPlayerDisplay.innerText = currentPlayer;
    currentPlayerDisplay.style.color = currentPlayer === 'X' ? 'red' : 'blue';
    xWins.innerText = currentScore['X'];
    oWins.innerText = currentScore['O'];

    for(let i = 0; i < spaces.length; i++) {

        // Gives hover animation
        spaces[i].addEventListener('mouseenter', (event) => {
            const spaceName = event.target.id;
            if (isSpaceEmpty(spaceName) && !gameWon && !isTied) {
                event.target.innerHTML = currentPlayer;
                if (currentPlayer === 'X') {
                    event.target.style.color = 'red';
                } else {
                    event.target.style.color = 'blue';
                }
            }
        });

        // Removes hover animation
        spaces[i].addEventListener('mouseleave', (event) => {
            const spaceName = event.target.id;
            if (isSpaceEmpty(spaceName) && !gameWon && !isTied) {
                event.target.innerHTML = '';
            }
        });
        
        // Adds click event, when game space chosen
        spaces[i].addEventListener('click', (event) => {
            const spaceName = event.target.id;
            event.target.innerHTML = '';
            //console.log(event.target.id);
            if (isSpaceEmpty(spaceName) && !gameWon && !isTied) {
                addPieceToBoard(event.target);
            }
        });
    }
});

// Adds current player to currentGame Matrix and visual game
const addPieceToBoard = (space) => {
    putValueOnBoard(space.id);
    space.innerHTML = currentPlayer;

    if (currentPlayer === 'X') {
        space.style.color = 'red';
    } else {
        space.style.color = 'blue';
    }

    if (isGameWon()) {
        banner.style.display = 'block';
        banner.innerHTML = `${currentPlayer} wins!`;
        banner.style.borderColor = currentPlayer === 'X' ? 'red' : 'blue';
        banner.style.color = currentPlayer === 'X' ? 'red' : 'blue';
        currentScore[currentPlayer]++;
        updateScore();
        gameWon = true;
    } else {
        nextPlayer();
    }
};

// Gets value at specified space from currentBoard matrix
const getValueFromBoard = spaceName => {
    const mappedLoc = gameBoardMapper[spaceName];
    return currentGame[mappedLoc[0]][mappedLoc[1]];
}

// Adds current player to currentBoard matrix
const putValueOnBoard = spaceName => {
    const mappedLoc = gameBoardMapper[spaceName];
    currentGame[mappedLoc[0]][mappedLoc[1]] = currentPlayer;
}

// Checks if value at specified location is empty
const isSpaceEmpty = spaceName => {
    return getValueFromBoard(spaceName) === -1;
}

const nextPlayer = () => {
    if (currentPlayer === 'X') {
        currentPlayer =  'O';
        currentPlayerDisplay.innerText = currentPlayer;
        currentPlayerDisplay.style.color = 'blue';
    } else {
        currentPlayer =  'X';
        currentPlayerDisplay.innerText = currentPlayer;
        currentPlayerDisplay.style.color = 'red';
    }
}

// Checks if game has been won
const isGameWon = () => {
    // Check through winning combinations
    //console.log(currentGame);
    let combinationsChecked = 0;
    for (let i = 0; i < winningCombinations.length; i++) {
        const combo = winningCombinations[i];
        // If any space from winning combo is undefined, move onto next
        if (combo.some(spaceName => isSpaceEmpty(spaceName))) {
            continue;
        }
        combinationsChecked++;
        const space1 = getValueFromBoard(combo[0]);
        const space2 = getValueFromBoard(combo[1]);
        const space3 = getValueFromBoard(combo[2]);
        if (space1 === space2 && space2 === space3) {
            return true;
        }
    }
    if (combinationsChecked === winningCombinations.length) {
       gameIsTied = true;
       banner.style.display = 'block';
       banner.innerHTML = 'Game is tied!';
    }
    return false;
}

const updateScore = () => {
    xWins.innerText = currentScore['X'];
    oWins.innerText = currentScore['O'];
}

const restartGame = () => {
    // Clears visual board
    const spaces = document.getElementsByClassName('space');
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].innerHTML = '';
    }

    // Clears current game matrix
    for (let i = 0; i < currentGame.length; i++) {
        for (let j = 0; j < currentGame[i].length; j++) {
            currentGame[i][j] = -1;
        }
    }
    gameWon = false;
    currentPlayer = 'X';
    banner.style.display = 'none';
    banner.style.borderColor = 'white';
    banner.style.color = 'white';
}