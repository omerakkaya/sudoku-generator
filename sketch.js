class Cell {
    constructor(x, y, cellGroup) {
        this.x = x;
        this.y = y;
        this.cellGroup = cellGroup;
        this.value = null;
        this.visited = false;
        this.options = [];
    }

    getNumberOption() {
        let options = [];
        for (let i = 1; i < 10; i++) {
            if (
                !this.cellGroup.cells.map(cell => cell.value).includes(i) &&
                !cells.filter(cell => cell.x == this.x).map(cell => cell.value).includes(i) &&
                !cells.filter(cell => cell.y == this.y).map(cell => cell.value).includes(i) &&
                this.value == null
            ) {
                options.push(i);
            }
        }
        this.options = options;
        return options;
    }
}

class CellGroup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cells = [];
    }

    addToGroup(cell) {
        this.cells.push(cell);
    }

    isNumberExist(num) {
        return this.cells.some(cell => cell.value == num);
    }
}

let canvasWidth = 900;
let canvasHeight = 900;
let cellGroups = [];
let cells = [];
let incorrectPlacementCount = 0;
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    noStroke();
    fill(220);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let cellGroup = new CellGroup(j, i);
            cellGroups.push(cellGroup);
            for (let t = 0; t < 9; t++) {
                let cell = new Cell(cellGroup.x * 3 + t % 3, cellGroup.y * 3 + Math.floor(t / 3), cellGroup);
                cells.push(cell);
                cellGroup.addToGroup(cell);
            }
        }
    }
}

let isDone = false;
let currentNum = 1;
function draw() {
    background(51);
    for (let i = 0; i < 10; i++) {
        stroke(64);
        if (i % 3 == 0) {
            stroke(255);
        }
        line(i * (canvasWidth / 9), 0, i * (canvasWidth / 9), canvasWidth);
    }
    for (let i = 0; i < 10; i++) {
        stroke(64);
        if (i % 3 == 0) {
            stroke(255);
        }
        line(0, i * (canvasHeight / 9), canvasHeight, i * (canvasHeight / 9))
    }

    if (!isDone) {
        for (let i = 0; i < 9; i++) {
            checkSingleNum(cellGroups, currentNum);

            if (cellGroups[i].isNumberExist(currentNum)) {
                continue;
            }

            let validCells = [];
            let nullCells = cellGroups[i].cells.filter(cell => cell.value == null);

            nullCells.forEach(cell => {
                if (!cells.find(gCell => gCell.x == cell.x && gCell.value == currentNum && gCell.y != cell.y) && !cells.find(gCell => gCell.y == cell.y && gCell.value == currentNum && gCell.x != cell.x)) {
                    validCells.push(cell);
                }
            });

            if (validCells.length != 0) {
                let randomCell = validCells[Math.floor(Math.random() * validCells.length)];
                randomCell.value = currentNum;
                checkSingleNum(cellGroups, currentNum);
            }
            else {
                let randomCell = nullCells[Math.floor(Math.random() * nullCells.length)];
                randomCell.value = currentNum;

                let xCell = cells.find(cell => cell.x == randomCell.x && cell.value == currentNum && cell.y != randomCell.y);
                if (xCell) {
                    xCell.value = null;
                }
                let yCell = cells.find(cell => cell.y == randomCell.y && cell.value == currentNum && cell.x != randomCell.x);
                if (yCell) {
                    yCell.value = null;
                }
                checkSingleNum(cellGroups, currentNum);

                if (incorrectPlacementCount >= 9) {
                    cells.forEach(cell => cell.value = null);
                    currentNum = 1;
                    i = -1;
                }
                incorrectPlacementCount++;
                i = -1;
                continue;
            }
        }
        currentNum++;
        incorrectPlacementCount = 0;
        isDone = !cells.some(cell => cell.value == null);
    }
    for (let i = 0; i < cells.length; i++) {
        fill(255, 255, 255);
        textSize(20)
        text(cells[i].value || "-", cells[i].x * canvasWidth / 9 + canvasWidth / 18, cells[i].y * canvasWidth / 9 + canvasWidth / 18);
    }
}

function clearSingleNumbers(cellGroups, currentNum) {
    while (isSingleNumberExist(currentNum)) {
        for (const cellGroup of cellGroups) {
            let generalArray = [];
            let countOfNumbers = [];
            for (const cell of cellGroup.cells) {
                generalArray = generalArray.concat(cell.getNumberOption());
            }
            for (let i = 1; i <= currentNum; i++) {
                countOfNumbers.push(generalArray.filter(item => item == i).length);
            }

            let countOfNumbersIndex = countOfNumbers.indexOf(1);
            for (const cell of cellGroup.cells) {
                if (cell.options.includes(countOfNumbersIndex + 1)) {
                    cell.value = countOfNumbersIndex + 1;
                }
            }
        }
    }

}

function isSingleNumberExist(currentNum) {
    let isExist = false;
    for (const cellGroup of cellGroups) {
        let generalArray = [];
        let countOfNumbers = [];
        for (const cell of cellGroup.cells) {
            let options = cell.getNumberOption();
            generalArray = generalArray.concat(options);
        }
        for (let i = 1; i <= currentNum; i++) {
            countOfNumbers.push(generalArray.filter(item => item == i).length);
        }
        if (countOfNumbers.indexOf(1) != -1) {
            isExist = true;
            break;
        }
    }

    return isExist;
}

function checkSingleNum(cellGroups, currentNum) {
    while (isSingleNumberExist(currentNum)) {
        clearSingleNumbers(cellGroups, currentNum);
    }
}