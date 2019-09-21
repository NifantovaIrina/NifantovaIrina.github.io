var canvas;
var context;

var n = -1;
var maskX = -1;
var maskY = -1;

var pointX;
var pointY;
var timeStep;
var turn;
var children;

var ind = 0;
var timeout = 50;
var sizeWindow = 300;
var flagStart = 0;
var sizeGame;

var meterArr;
var logMask;
var logBall;
var ballArr;
var color = [
"#0000FF", "#00FF00", "#FF0000",
"#00FFFF", "#FFFF00", "#FF00FF",
"#00008F", "#008F00", "#8F0000",
"#008F8F", "#8F8F00", "#8F008F",
"#008FFF", "#8FFF00", "#8F00FF",
"#00FF8F", "#FF8F00", "#FF008F",
            ];

function updateSpeed(idSpeed) {
    var speed = document.getElementById(idSpeed).value;
    timeout = speed;
}
function updateSize(idSize) {
    var size  = document.getElementById(idSize).value;
    ind = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    sizeWindow = size;
    document.getElementById("war").height = sizeWindow;
    document.getElementById("war").width  = sizeWindow;
}

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    return result;
}

window.onload = function() {
    canvas = document.getElementById("war");
    sliderSize = document.getElementById("size");
    sliderSize.max = 
        document.getElementById("area_for_window").clientWidth - 25;

    context = canvas.getContext("2d");
 
    var string = loadFile("../server/gardeners/result/resultWar.txt");
    var arr = string.split(' ');
    var ind = 0;

    n = Number(arr[0]);
    maskX = Number(arr[1]);
    maskY = Number(arr[2]);
    ind = 3;

    pointX = [];
    pointY = [];
    timeStep=[];
    turn   = [];
    children=[];
    logMask =[];
    logBall =[];

    for (var i = 0; i < n; ++i) {
        children.push(arr[i + ind]);
    }

    ind += n;

    for (var i = ind; i < arr.length;) {
        if (arr[i] != "")
            pointX.push(Number(arr[i]));
        else break;
        ++i;
        if (arr[i] != "")
            pointY.push(Number(arr[i]));
        else break;
        ++i;
        if (arr[i] != "")
            timeStep.push(arr[i]);
        else break;
        ++i;
        if (arr[i] != "")
            turn.push(arr[i]);
        else break;
        ++i;
    }

    sizeGame = pointX.length;
    updateSize("size");
    updateSpeed("speed");
    check("result", "result_check");
    check("predok", "log_check");
    startLog();
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function start() {
    flagStart = 1;
    setTimeout("play()", timeout);
}
function stop() {
    flagStart = 0;
}
function next() {
    paint();
    ind += 1;
    if (ind * n > sizeGame) {
        flagStart = 0;
        ind =  n;
    }
}
function begin() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearTable();
    ind = 0;
    paint();
    startLog();
}
function play() {
    if (!flagStart) return;
    next();
    if (flagStart) setTimeout("play()", timeout);
}
function end() {
    //context.clearRect(0, 0, canvas.width, canvas.height);
    //ind = point.length / n / 2 - 1;
    flagStart = 0;
    //ind = sizeGame;
    context.beginPath();
    var sizePointX = sizeWindow / maskX;
    var sizePointY = sizeWindow / maskY;
    while (ind * n <= sizeGame) {
        addTable(ind);
        for (var i = ind * n; i < (ind + 1) * n; i += 1) {
            var num = i - ind * n;
            if (logMask[pointX[i]][pointY[i]] == 0) {
                ++logBall[num];
                logMask[pointX[i]][pointY[i]] = 1;
            }
            context.fillStyle = color[num % color.length];
            context.fillRect((pointX[i]) * sizePointY, 
                             (maskY - pointY[i] - 1) * sizePointX, sizePointY, sizePointX);
        }
        ind = ind + 1;
        if (ind % 10 == 0) {
            console.log("dimka");
		context.closePath();
            context.fill();
            context.beginPath();
        }
    }
            
    updateLog();
    context.closePath();
    context.fill();
}
/*
function prev() {
    if (ind != 0) ind -= 1;
    paint();
}
*/

function paint() {
    context.beginPath();
    var sizePointX = sizeWindow / maskX;
    var sizePointY = sizeWindow / maskY;

    addTable(ind);
    for (var i = ind * n; i < (ind + 1) * n; i += 1) {
        var num = i - ind * n;
        if (logMask[pointX[i]][pointY[i]] == 0) {
            ++logBall[num];
            logMask[pointX[i]][pointY[i]] = 1;
        }
        context.fillStyle = color[num % color.length];
        context.fillRect((pointX[i]) * sizePointY, 
                         (maskY - pointY[i] - 1) * sizePointX, sizePointY, sizePointX);
    }
    updateLog();
    context.closePath();
    context.fill()
}

function startLog() {
    var result = document.getElementById("result");
    var table = document.getElementById("result_table");
    var new_table = document.createElement("table");
    new_table.className = "table_resulti";
    new_table.id = "result_table";
    new_table.innerHTML =
        "<tr><td>Имя</td><td>Цвет</td><td>Прогресс</td><td>Балл</td></tr>";
    result.replaceChild(new_table, table);
    
    logBall = [];
    meterArr= [];
    ballArr = [];
    
    logMask = [];

    for (var i = 0; i < maskX; ++i) {
        logMask.push([]);
        for (var j = 0; j < maskY; ++j) {
            logMask[i].push(0);
        }
    }

    for (var i = 0; i < n; ++i) {
        var newEl = document.createElement("tr");
        logBall.push(0);
        newEl.innerHTML = "<td>" + children[i % n] + "</td>" + 
                          "<td bgcolor=" + color[i % color.length] + "></td>" +
                          "<td><meter max='"+String(maskX * maskY)+
                                "'value='"+ String(logBall[i]) +
                                "'></meter></td>" + 
                          "<td><div>"+ String(logBall[i]) +"</div></td>";
        new_table.appendChild(newEl);
        meterArr.push(newEl.children[2].firstChild);
        ballArr.push(newEl.children[3].firstChild);
    }
}

function updateLog() {
    for (var i = 0; i < n; ++i) {
        meterArr[i].value = logBall[i];
        ballArr[i].innerHTML = logBall[i];
    }
}

function addTable(ind) {
    for (var i = ind * n; i < (ind + 1) * n; ++i) {
        var tr = document.createElement("tr");
        var table = document.getElementById("log");
        var last = table.children[1];
        tr.innerHTML = "<td>" + ind + "</td>" + 
                       "<td>" + children[i % n] + "</td>"+
                       "<td>" + timeStep[i] + "</td>"+
                       "<td>" + turn[i] +"</td>";
        table.insertBefore(tr, last);
    }
}

function clearTable() {
    var predok = document.getElementById("predok");
    var table = document.getElementById("log");
    var new_table = document.createElement("table");
    new_table.className = "table_result";
    new_table.id = "log";
    new_table.innerHTML = 
        "<tr><td>Ход №</td><td>Имя</td><td>Время</td><td>Ход</td></tr>";
    predok.replaceChild(new_table, table);
}
