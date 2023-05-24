let board = [];
let rows = 10;
let columns = 10;

let minesCount = 10;
let minesLocation = [];

let tilesClicked = 0;
let flagEnabled = false;

let gameOver = false;

window.onload = function() {
    startGame();
}

function setMines(excludedRow, excludedCol) {
    let validLocations = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (r !== excludedRow || c !== excludedCol) {
                validLocations.push(r + "-" + c);
            }
        }
    }

    while (minesLocation.length < minesCount && validLocations.length > 0) {
        const randomIndex = Math.floor(Math.random() * validLocations.length);
        const mineLocation = validLocations[randomIndex];

        minesLocation.push(mineLocation);
        validLocations.splice(randomIndex, 1);
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("new-game-button").addEventListener("click", resetGame);

    //заполняем доску 
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.addEventListener("click", clickTile);
            tile.id = i.toString() + "-" + c.toString();
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    } 
    console.log(board);
}

function setFlag() {
    let flagButton = document.getElementById("flag-button");

    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}


function clickTile() {

    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    let tileId = tile.id;

    if (minesLocation.length === 0) {

        let coords = tile.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        setMines(r, c);
    }

    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
            minesCount--;
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
            minesCount++;
        }
        document.getElementById("mines-count").innerText = minesCount;
        checkMine(r, c);
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        alert("GAME OVER. TRY AGAIN");
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 
    minesFound += checkTile(r-1, c-1);
    minesFound += checkTile(r-1, c);
    minesFound += checkTile(r-1, c+1);

    //left and right
    minesFound += checkTile(r, c-1);
    minesFound += checkTile(r, c+1);

    //bottom
    minesFound += checkTile(r+1, c-1);
    minesFound += checkTile(r+1, c);
    minesFound += checkTile(r+1, c+1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //top
        checkMine(r-1, c-1);
        checkMine(r-1, c);
        checkMine(r-1, c+1);

        //left and right
        checkMine(r, c-1);
        checkMine(r, c+1);

        //bottom
        checkMine(r+1, c-1);
        checkMine(r+1, c);
        checkMine(r+1, c+1);
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
        alert("Congratulations! You won the game!");
    }
}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function resetGame() {
    // Сбросить все переменные и состояние игры
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    flagEnabled = false;
    gameOver = false;
    minesCount = 10; // Сбросить счетчик флажков на исходное значение

    // Удалить все плитки из доски
    let boardElement = document.getElementById("board");
    while (boardElement.firstChild) {
        boardElement.firstChild.remove();
    }

    startGame();
}


function generateGameUI() {
    const minesHeader = document.createElement('h1');
    const minesCountSpan = document.createElement('span');
    const boardDiv = document.createElement('div');
    const br = document.createElement('br');
    const flagButton = document.createElement('button');
    const newGameButton = document.createElement('button');
  
    minesHeader.textContent = 'Mines: ';
    minesCountSpan.id = 'mines-count';
    minesCountSpan.textContent = '0';
    minesHeader.appendChild(minesCountSpan);
  
    boardDiv.id = 'board';
  
    flagButton.id = 'flag-button';
    flagButton.textContent = '🚩';
  
    newGameButton.id = 'new-game-button';
    newGameButton.textContent = 'New Game';
  
    document.body.appendChild(minesHeader);
    document.body.appendChild(boardDiv);
    document.body.appendChild(br);
    document.body.appendChild(flagButton);
    document.body.appendChild(newGameButton);
  
    // Генерация клеток доски
    const rows = 10;
    const columns = 10;
  
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("div");
        row.className = "row";
    
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.addEventListener("click", clickTile);
            tile.id = i.toString() + "-" + c.toString();
            row.appendChild(tile);
            row.push(tile);
        }
    
        document.getElementById("board").appendChild(row);
    }     
    
  }
  
  generateGameUI();
  
  