let mines;
let maxRowCol;
let nrMinesHeader;
let maxNoMineCells;
let maxRowColInput;
let maxRowColHeader;
let maxRowColButton;
let matrixCells = [];
let nrOfNoMineCells = 0;
let counterOfPossibleMines;
let container = document.getElementById("container");
let table = document.createElement("table");

function askUserTableDimension() {
    nrMinesHeader = document.getElementById("nrMinesHeader");
    maxRowColHeader = document.getElementById("maxRowColHeader");
    maxRowColInput = document.getElementById("maxRowColInput");
    maxRowColButton = document.getElementById("maxRowColButton");
    maxRowColButton.addEventListener("click", () => createTableandMatrix());
}

function createTableandMatrix() {
    maxRowCol = maxRowColInput.value;
    mines = maxRowCol;
    maxNoMineCells = maxRowCol * maxRowCol - mines;
    counterOfPossibleMines = mines;
    maxRowColButton.style.display = "none";
    maxRowColInput.style.display = "none";
    maxRowColHeader.innerHTML = "Click on any cell in order to start the game.";
    nrMinesHeader.innerHTML = "You should avoid: " + mines + " MINES!";
    table.className = "center";
    for (let i = 0; i < maxRowCol; ++i) {
        matrixCells[i] = [];
        let tableRow = document.createElement("tr");
        for (let j = 0; j < maxRowCol; ++j) {
            matrixCells[i][j] = 0;
            let cell = document.createElement("td");
            cell.className = "tableData";
            cell.id = "cell" + "[" + i + "]" + "[" + j + "]";
            cell.addEventListener("click", () => checkCellValue(i, j));
            cell.addEventListener("contextmenu", (event) => addOrRemoveMineFlag(event, i, j))
            tableRow.appendChild(cell);
        }
        table.appendChild(tableRow);
    }
    container.appendChild(table);
    createMinesAndNumbers();
}

let counter = 0;
let randomPositionIArray = []
let randomPositionJArray = []
let neighbors;

function createMinesAndNumbers() {
    while (randomPositionIArray.length < mines) {
        let randomPositionI = Math.floor(Math.random() * maxRowCol);
        let randomPositionJ = Math.floor(Math.random() * maxRowCol);
        if (randomPositionIArray.includes(randomPositionI) == false) {
            randomPositionIArray.push(randomPositionI);
            randomPositionJArray.push(randomPositionJ);
            matrixCells[randomPositionI][randomPositionJ] = "x";
        }   
    }

    for (let i = 0; i < maxRowCol; ++i) {
        for (let j = 0; j < maxRowCol; ++j) {
            if (matrixCells[i][j] == "x") {
                findNeighbors(i, j);
                for (let k = 0; k < neighbors.length; ++k) {
                    if (matrixCells[Math.floor(neighbors[k] / 100)][neighbors[k] % 100] != "x") {
                        ++matrixCells[Math.floor(neighbors[k] / 100)][neighbors[k] % 100];
                    }
                }
            }
        }
    }  
}

let arrayOfFlags = [];
let i_j_CoordinatesFlag = [];
let queque = [];


function addOrRemoveMineFlag(event, i, j) {
    event.preventDefault();
    let cell = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
    if (counterOfPossibleMines > 0 && i_j_CoordinatesFlag.includes(i * 100 + j) == false) {
        i_j_CoordinatesFlag.push( i * 100 + j);
        --counterOfPossibleMines;
        cell.style.backgroundImage = "url('images/flag.png')";
    } else if (i_j_CoordinatesFlag.includes(i * 100 + j) == true) {
        i_j_CoordinatesFlag.splice(i_j_CoordinatesFlag.indexOf(i * 100 + j), 1);
        ++counterOfPossibleMines;
        cell.style.backgroundImage = 'none';
    }
    nrMinesHeader.innerText = "You should avoid: " + counterOfPossibleMines + " MINES!";
}

function checkCellValue(i, j) {
    let cell = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
    if (matrixCells[i][j] == 'x') {
        for (let i = 0; i < maxRowCol; ++i) {
            for (let j = 0; j < maxRowCol; ++j) {
                if (matrixCells[i][j] == 'x') {
                    cell = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
                    cell.style.backgroundImage = "url('images/bomb.png')";
                }
            }
        }
        checkWonOrLostGame("lost");
    } else if (matrixCells[i][j] == 0){
        queque.push(i * 100 + j);
        displayEmptyCellsAndNumbers();
    } else {
        ++nrOfNoMineCells;
        cell.innerHTML = matrixCells[i][j];
        cell.style.backgroundColor = "rgb(78, 197, 244)";
        if (nrOfNoMineCells == maxNoMineCells) {
            checkWonOrLostGame("won");
        }
    }
}

let displayedCells = [];

function displayEmptyCellsAndNumbers() {
    while (queque.length > 0) {
        let i = Math.floor(queque[0] / 100);
        let j = queque[0] % 100;
        displayedCells.push(queque[0]);
        queque.shift();
        let cell = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
        if (matrixCells[i][j] == 0) {
            cell.innerHTML = "";
            findNeighbors(i, j);
            for (let k = 0; k < neighbors.length; ++k) {
                if (queque.includes(neighbors[k]) == false && displayedCells.includes(neighbors[k]) == false) {
                    queque.push(neighbors[k]);
                }
            }
        } else {
            cell.innerHTML = matrixCells[i][j];
        }
        ++nrOfNoMineCells;
        cell.style.backgroundColor = "rgb(78, 197, 244)";
    }
}

function findNeighbors(i, j) {
    neighbors = [];
    for (let indexI = i - 1; indexI <= i + 1; ++indexI) {
        for (let indexJ = j - 1; indexJ <= j + 1; ++indexJ) {
            if (indexI >= 0 && indexI <= maxRowCol - 1 && indexJ >= 0 && indexJ <= maxRowCol - 1) {
                if (!(indexI == i && indexJ == j)) {
                    neighbors.push(indexI * 100 + indexJ);
                }
            }
        }
    }
}

function checkWonOrLostGame(message) {
    let resetButton = document.createElement("button");
    resetButton.className = "btn btn-outline-dark";
    if (message == "lost") {
        resetButton.innerHTML = "You lost the Game. Click here to play again.";
    } else {
        resetButton.innerHTML = "You won the Game. Click here to play again.";
    }
    resetButton.addEventListener("click", () => window.location.reload());
    container.appendChild(resetButton);
}

askUserTableDimension();