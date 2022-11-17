let mines = 10;
let maxRowCol = 9;
let nrOfNoMineCells = 0;
let maxMineCells = 71;
let container = document.getElementById("container");
let table = document.createElement("table");

function createTable() {
    table.className = "center";
    for (let i = 0; i < maxRowCol; ++i) {
        let tableRow = document.createElement("tr");
        for (let j = 0; j < maxRowCol; ++j) {
            let cell = document.createElement("td");
            cell.className = "tableData";
            cell.id = "cell" + "[" + i + "]" + "[" + j + "]";
            cell.addEventListener("click", () => checkMines(i, j));
            cell.addEventListener("contextmenu", (event) => addMineFlag(event, i, j))
            tableRow.appendChild(cell);
        }
        table.appendChild(tableRow);
    }
    container.appendChild(table);
    createMinesAndNumbers();
}

let counter = 0;
let matrixCells = [];
let mineArrayPosition = []

function createMinesAndNumbers() {
    for (let i = 0; i < maxRowCol; ++i) {
        matrixCells[i] = [];
        for (let j = 0; j < maxRowCol; ++j) {
            matrixCells[i][j] = 0;
        }
    }

    while (mineArrayPosition.length < mines) {
        let randomPosition = Math.floor(Math.random() * (maxRowCol * maxRowCol));
        if (mineArrayPosition.includes(randomPosition) == false && randomPosition % 10 != 9) {
            mineArrayPosition.push(randomPosition);
            matrixCells[Math.floor(randomPosition / 10)][randomPosition % 10] = "x";
        }
    }

    for (let i = 0; i < maxRowCol; ++i) {
        for (let j = 0; j < maxRowCol; ++j) {
            let matrixValue = matrixCells[i][j];
            if (matrixValue == "x") {
                if (i - 1 >= 0 && j - 1 >= 0 && matrixCells[i - 1][j - 1] != "x") {
                    ++matrixCells[i - 1][j - 1];
                }
                if (i - 1 >= 0 && matrixCells[i - 1][j] != "x") {
                    ++matrixCells[i - 1][j];
                }
                if (i - 1 >= 0 && j + 1 <= 8 && matrixCells[i - 1][j + 1] != "x") {
                    ++matrixCells[i - 1][j + 1];
                }
                if (j - 1 >= 0 && matrixCells[i][j - 1] != "x") {
                    ++matrixCells[i][j - 1];
                }
                if (i + 1 <= 8 && j - 1 >= 0 && matrixCells[i + 1][j - 1] != "x") {
                    ++matrixCells[i + 1][j - 1];
                }
                if (i + 1 <= 8 && matrixCells[i + 1][j] != "x") {
                    ++matrixCells[i + 1][j];
                }
                if (j + 1 <= 8 && matrixCells[i][j + 1]!= "x") {
                    ++matrixCells[i][j + 1];
                }
                if (i + 1 <= 8 && j + 1 <= 8 && matrixCells[i + 1][j + 1] != "x") {
                    ++matrixCells[i + 1][j + 1];
                }
            }
        }
    }  
    for (let i = 0; i < maxRowCol; ++i) {
        for (let j = 0; j < maxRowCol; ++j) {
            if (matrixCells[i][j] == 0) {
                matrixCells[i][j] = "";
            }
        }
    }
    console.log(matrixCells);
}

let counterOfPossibleMines = 10;
let arrayOfFlags = [];
let i_j_CoordinatesFlag = [];
let queque = [];


function addMineFlag(event, i, j) {
    event.preventDefault();
    let cell = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
    if (counterOfPossibleMines > 0 && i_j_CoordinatesFlag.includes(i * 10 + j) == false) {
        i_j_CoordinatesFlag.push( i * 10 + j);
        --counterOfPossibleMines;
        cell.style.backgroundImage = "url('images/flag.png')";
    } else if (i_j_CoordinatesFlag.includes(i * 10 + j) == true) {
        i_j_CoordinatesFlag.splice(i_j_CoordinatesFlag.indexOf(i * 10 + j), 1);
        ++counterOfPossibleMines;
        cell.style.backgroundImage = 'none';
    }
    document.getElementById("nrMinesHeader").innerText = "You should avoid: " + counterOfPossibleMines + " MINES!";
}

function checkMines(i, j) {
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
    } else if (matrixCells[i][j] == ""){
        queque.push(i * 10 + j);
        displayNearSpacesAndNumbers();
    } else {
        ++nrOfNoMineCells;
        cell.innerHTML = matrixCells[i][j];
        cell.style.backgroundColor = "rgb(78, 197, 244)";
        if (nrOfNoMineCells == maxMineCells) {
            checkWonOrLostGame("won");
        }
    }
}

let displayedCells = [];
let neighbors;

function displayNearSpacesAndNumbers() {
    while (queque.length > 0) {
        let i = Math.floor(queque[0] / 10);
        let j = queque[0] % 10;
        displayedCells.push(queque[0]);
        queque.shift();
        let cell = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
        if (matrixCells[i][j] == "") {
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
    if (i - 1 >= 0 && j - 1 >= 0) {
        neighbors.push((i - 1) * 10 + j - 1);
    }
    if (i - 1 >= 0) {
        neighbors.push((i - 1) * 10 + j);
    }
    if (i - 1 >= 0 && j + 1 <= 8) {
        neighbors.push((i - 1) * 10 + j + 1);
    }
    if (j - 1 >= 0) {
        neighbors.push(i * 10 + j - 1);
    }
    if (i + 1 <= 8 && j - 1 >= 0) {
        neighbors.push((i + 1) * 10 + j - 1);
    }
    if (i + 1 <= 8) {
        neighbors.push((i + 1) * 10 + j);
    }
    if (j + 1 <= 8) {
        neighbors.push(i * 10 + j + 1);
    }
    if (i + 1 <= 8 && j + 1 <= 8) {
        neighbors.push((i + 1) * 10 + j + 1);
    }
}

function checkWonOrLostGame(message) {
    let resetButton = document.createElement("button");
    resetButton.className = "btn btn-outline-dark";
    if (message == "lost") {
        resetButton.innerHTML = "You lost the Game. Click here to play again.";
    } else {
        resetButton.innerHTML = "You win the Game. Click here to play again.";
    }
    resetButton.addEventListener("click", () => window.location.reload());
    container.appendChild(resetButton);
}

createTable();
