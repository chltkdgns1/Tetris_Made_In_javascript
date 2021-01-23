
var userData = {  // 게임 전반적인 데이터
    score: 0,
    level: 0
}

var timeSpeed = 300; 
var height = 25;
var width = 10;

var blockData = null;

// 회전하는 블록을 포함하는 블록들


var color = ["w", "../img/red", "../img/orange", "../img/wgreen", "../img/yellow", "../img/green", "../img/blue", "../img/puple"];


var realBlocks = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 2, 2, 0],
        [2, 2, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [3, 3, 0, 0],
        [3, 3, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [4, 0, 0],
        [4, 4, 4],
        [0, 0, 0]
    ],
    [
        [0, 0, 5],
        [5, 5, 5],
        [0, 0, 0]
    ],
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [7, 7, 0, 0],
        [0, 7, 7, 0],
        [0, 0, 0, 0]
    ]
]

var pathStr = "../img/"; // 경로 
var ext = ".png"; // 확장자
var gameMap = null; // 맵 (맵이 존재하는 이유는 충돌 판정을 해주기 위해서)
var canvasText = null;

function makeBoard(y, x) { // 맵 만들기
    var temp = [];
    for (var i = 0; i < y; i++) {
        var a = [];
        for (var k = 0; k < x; k++) {
            a.push(0);
        }
        temp.push(a);
    }
    return temp;
}

function printBoard(board) { // 맵 출력
    var str = "";
    for (var i = 0; i < board.length; i++) {
        for (var k = 0; k < board[i].length; k++) {
            str += board[i][k] + " ";
        }
        str += '\n';
    }
    console.log(str);
}


function getRandomBlock() { // 랜덤 블럭값 생성
    var randData = Math.floor(Math.random() * 10) % 7;
    return {
        x: 3,
        y: 0,
        col: randData + 1,
        board: realBlocks[randData]
    }
}

function isCheckEmpty() { // 블록을 사용했는지 파악
    if (blockData['board'] === null) return true;
    return false;
}

function speedUp() { // 스피드 업

}

function reBlocking(){
    isFillBlock();
    createInit();
}

function isValidMove(ch) {
    // 회전인 경우나
    // 왼쪽 오른쪽 이동의 경우
    // 이동 후에 충돌되는 경우인지 체크

    var len = blockData.board.length;
    var x = blockData.x; // x 위치
    var y = blockData.y; // y 위치

    if (ch == 83) {
        if (isColide(blockData.board, len, x, y + 1)) {
            inputBlockToMap(blockData.board, len, x, y);
            reBlocking();
            return;
        }
        printBoardMap(blockData.board, len, x, y, blockData.col, 0);
        blockData.y += 1;
        printBoardMap(blockData.board, len, x, y + 1, blockData.col, 1);
    }

    //ch == 65 || ch == 68 || ch == 82 || ch == 86
    else if (ch == 65) {
        if (isColide(blockData.board, len, x - 1, y)) return;
        printBoard(blockData.board);
        printBoardMap(blockData.board, len, x, y, blockData.col, 0);
        printBoardMap(blockData.board, len, x - 1, y, blockData.col, 1);
        blockData.x -= 1;
    }
    else if (ch == 68) {
        if (isColide(blockData.board, len, x + 1, y)) return;
        printBoardMap(blockData.board, len, x, y, blockData.col, 0);
        printBoardMap(blockData.board, len, x + 1, y, blockData.col, 1);
        blockData.x += 1;
    }
    else if (ch == 86) { // 한방에 내려감
        while(!(isColide(blockData.board, len, blockData.x, blockData.y + 1))){
            printBoardMap(blockData.board, len, blockData.x, blockData.y, blockData.col, 0);
            blockData.y += 1;
            printBoardMap(blockData.board, len, blockData.x, blockData.y, blockData.col, 1);
        }
        inputBlockToMap(blockData.board,len,blockData.x, blockData.y);
        reBlocking();
        printBoard(gameMap);
    }
    else if (ch == 82) {
        Lotation();
    }
}

function inputBlockToMap(temp, len, x, y) {
    for (var i = y; i < y + len; i++) {
        for (var k = x; k < x + len; k++) {
            if (!checkOut(k, i))
                gameMap[i][k] = (temp[i - y][k - x] ? temp[i - y][k - x] : gameMap[i][k]);
        }
    }
}

function checkEndPoint(){
    for(var i = 0 ; i < width; i++){
        if(gameMap[0][i]){
            return true;
        }
    }
    return false;
}

function printBoardMap(temp, len, x, y, col, ch) {
    if (ch == 1) { // 생성
        var pimg = color[col] + ext; // 이미지 
        var img = document.createElement('img');
        img.src = pimg;

        for (var i = y; i < y + len; i++) {
            for (var k = x; k < x + len; k++) {
                if (temp[i - y][k - x] != 0) {
                    canvasText.drawImage(img, k * 15, i * 15, 15, 15);
                }
            }
        }
    }
    else { // 삭제
        for (var ii = y; ii < y + len; ii++) {
            for (var kk = x; kk < x + len; kk++) {
                if (temp[ii - y][kk - x] != 0) {
                    canvasText.clearRect(kk * 15 - 1, ii * 15 - 1, 17, 17);
                }
            }
        }
    }
}

function Lotation() {
    var xidx = blockData.x; // x 위치
    var yidx = blockData.y; // y 위치

    var len = blockData.board.length;
    var tempBoard = blockData.board;
    var temp = makeBoard(len, len);

    for (var i = 0; i < len; i++) {
        for (var k = 0; k < len; k++) {
            temp[k][len - 1 - i] = tempBoard[i][k];
        }
    }

    if (isColide(temp, len, xidx, yidx)) return; // 회전 후 충돌이면 나가리

    printBoardMap(blockData.board,blockData.board.length,xidx,yidx,blockData.col,0);
    blockData.board = temp;
    printBoardMap(blockData.board,blockData.board.length,xidx,yidx,blockData.col,1);
  
    // 새로운 보드 그림 추가
    // 실제 사진이랑 배열이랑 위치 차이가 존재하니 처리 필요 일단
    // 실데이터부터 처리
}

function isFillBlock(){
    var ch = 0;
    for(var i = height - 1; i >= 0;i--){

        var cnt = 0;

        for(var k = 0; k < width;k++){
            if(gameMap[i][k] != 0) cnt++;     
        }

        if(cnt == width) {
            fillUpToDown(i- 1);
            i++;
            ch++;
        }
    }

    userData.score += ch * 10;
    if(userData.level < parseInt(userData.score / 100) + 1){
        timeSpeed -= 50;
        timeSpeed = max(timeSpeed,0);
        userData.level = parseInt(userData.score / 100) + 1;
    }

    $('#score').text("점수 : " + userData.score);
    $('#level').text("레벨 : " + userData.level);

    if(ch) gameMapRealPrint();
}

function gameMapRealPrint(){

    console.log("여기는 언제?");
    var img = document.createElement('img');

    for(var i = 0; i < height; i++){
        for(var k = 0; k < width;k++){        
            var t = gameMap[i][k];
            if(t){
                var pimg = color[t] + ext; 
                console.log("i k t pimg: " + i + " " + k + " " + t + " " + pimg);
                img.src = pimg;
                canvasText.drawImage(img, k * 15, i * 15, 15, 15);
            }
            else canvasText.clearRect(k * 15 - 1, i * 15 - 1, 17, 17);
        }
    }
}

function fillUpToDown(idx){

    if(idx < 0) return -1; // 비정상
    
    printBoard(gameMap);
    for(var i = idx; i >= 0; i--){
        for(var k = 0; k < width;k++){
            gameMap[i + 1][k] = gameMap[i][k];
        }
    }
    printBoard(gameMap);
    for(var kk = 0; kk < width;kk++) gameMap[0][kk] = 0;
    printBoard(gameMap);
    return 0; // 정상
}


function min(a, b) {
    return a < b ? a : b;
}
function max(a, b) {
    return a < b ? b : a;
}

function checkOut(x, y) {
    return x < 0 || x >= width || y < 0 || y >= height;
}

function isColide(temp, len, x, y) { 

    // 이동 회전 후 충돌 체크
    // y 값의 min max
    // x 값의 min max 를 구해야함

    var ymn = 1e9, ymx = -1, xmn = 1e9, xmx = -1;

    for (var i = y; i < y + len; i++) {
        for (var k = x; k < x + len; k++) {

            if (temp[i - y][k - x]) {
                ymn = min(ymn, i);
                ymx = max(ymx, i);
                xmn = min(xmn, k);
                xmx = max(xmx, k);
            }

            if (!checkOut(k, i) && gameMap[i][k] && temp[i - y][k - x]) return true; // 충돌이 난 경우
        }
    }

    if (ymn < 0 || xmn < 0 || ymx >= height || xmx >= width) return true;

    // 회전이나 좌 우 이동시 또는 아래 내려가는 경우에 해당 요소 중 하나가 벗어난 경우 체크
    return false; // 충돌이 안 난 경우
}

function createInit() {
    blockData = getRandomBlock(); // 랜덤 블록 데이터 생성
    printBoardMap(blockData.board, blockData.board.length, blockData.x, blockData.y, blockData.col, 1);
}

function keyCheck(ch) { // 허락된 문자인지 체크
    if (ch == 65 || ch == 68 || ch == 82 || ch == 83 || ch == 86) return true;
    return false;
}

function Start() {

    userData.level = 1;
    userData.score = 0;

    console.log("시작");

    canvasText = document.getElementById("canvas").getContext("2d");
    gameMap = makeBoard(height, width);

    timeSpeed = 300; // 1초에 한 칸 아래로 이동
    createInit();

    var click = null;
    var interval = setInterval(() => {
        if (!isCheckEmpty()) {
            isValidMove(83);
        }
        if(checkEndPoint()){
            clearInterval(interval);
            document.removeEventListener('keydown',click);
            gameMap = makeBoard(height, width);
            gameMapRealPrint();
            alert("게임 오버~");
            return;
        }
        // 여기다가도 충돌 판정 넣어야하고
    }, timeSpeed);

    click = (event) => {
        console.log("들어옴????");
        var ch = event.keyCode;
        if (keyCheck(ch)) {
            // console.log("들어옴? : " + ch);
            isValidMove(ch);
        }
        if(checkEndPoint()){
            clearInterval(interval);
            document.removeEventListener('keydown',click);
            gameMap = makeBoard(height, width);
            gameMapRealPrint();
            alert("게임 오버~");
            return;
        }
    };
    document.addEventListener('keydown', click);
}

