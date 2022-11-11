let mines = 10;
let maxRowCol = 9;
let container = document.getElementById("container");
let table = document.createElement("table");

function createTable() {
    table.className = "center";
    for (let i = 0; i < maxRowCol; ++i) {
        let tableRow = document.createElement("tr");
        tableRow.id = "tableRow";
        for (let j = 0; j < maxRowCol; ++j) {
            let cell = document.createElement("td");
            cell.className = "tableData";
            cell.id = "cell" + "[" + i + "]" + "[" + j + "]";
            cell.addEventListener("click", () => checkMines());
            tableRow.appendChild(cell);
        }
        table.appendChild(tableRow);
    }
    container.appendChild(table);
    generateMinesAndNumbers();
}

let counter = 0;
let arrayCells = [];
let matrixCells = [];
let mineArrayPosition = []

function generateMinesAndNumbers() {
    for (let i = 0; i < maxRowCol; ++i) {
        matrixCells[i] = [];
        for (let j = 0; j < maxRowCol; ++j) {
            matrixCells[i][j] = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
            matrixCells[i][j].innerHTML = 0;
            arrayCells[counter] = document.getElementById("cell" + "[" + i + "]" + "[" + j + "]");
            ++counter;
        }
    }
    while (mineArrayPosition.length < mines) {
        let randomPosition = Math.floor(Math.random() * (maxRowCol * maxRowCol));
        if (mineArrayPosition.includes(randomPosition) == false) {
            mineArrayPosition.push(randomPosition);
            arrayCells[randomPosition].innerHTML = "x";
        }
    }
    for (let i = 0; i < maxRowCol; ++i) {
        for (let j = 0; j < maxRowCol; ++j) {
            let matrixValue = matrixCells[i][j].innerHTML;
            if (matrixValue == "x") {
                if (i - 1 >= 0 && j - 1 >= 0 && matrixCells[i - 1][j - 1].innerHTML != "x") {
                    ++matrixCells[i - 1][j - 1].innerHTML;
                }
                if (i - 1 >= 0 && matrixCells[i - 1][j].innerHTML != "x") {
                    ++matrixCells[i - 1][j].innerHTML;
                }
                if (i - 1 >= 0 && j + 1 <= 8 && matrixCells[i - 1][j + 1].innerHTML != "x") {
                    ++matrixCells[i - 1][j + 1].innerHTML;
                }
                if (j - 1 >= 0 && matrixCells[i][j - 1].innerHTML != "x") {
                    ++matrixCells[i][j - 1].innerHTML;
                }
                if (i + 1 <= 8 && j - 1 >= 0 && matrixCells[i + 1][j - 1].innerHTML != "x") {
                    ++matrixCells[i + 1][j - 1].innerHTML;
                }
                if (i + 1 <= 8 && matrixCells[i + 1][j].innerHTML != "x") {
                    ++matrixCells[i + 1][j].innerHTML;
                }
                if (j + 1 <= 8 && matrixCells[i][j + 1].innerHTML != "x") {
                    ++matrixCells[i][j + 1].innerHTML;
                }
                if (i + 1 <= 8 && j + 1 <= 8 && matrixCells[i + 1][j + 1].innerHTML != "x") {
                    ++matrixCells[i + 1][j + 1].innerHTML;
                }
            }
        }
    }
    for (let i = 0; i < maxRowCol; ++i) {
        for (let j = 0; j < maxRowCol; ++j) {
            let matrixValue = matrixCells[i][j].innerHTML;   
            if (matrixValue == 0) {
                matrixCells[i][j].innerHTML = "";
            }
        }
    }
}





createTable();