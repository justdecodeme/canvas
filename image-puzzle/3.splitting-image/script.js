const PUZZLE_DIFFICULTY = 4;
var _canvas = document.getElementById('canvas');
var _cw = _canvas.width, _ch = _canvas.height;
var _ctx = _canvas.getContext('2d');
var _file = document.getElementById('file');
let _img = document.getElementById('img')
var _pieceWidth;
var _pieceHeight;

var tileCount = 3;
var tileSize;

_ctx.font = "20px Arial";
_ctx.fillStyle = "grey";
_ctx.textAlign = "center";
_ctx.fillText("Drop an image onto the canvas", _cw/2, _ch/2);

var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;

var boardParts;
var imgLoaded;

_file.addEventListener('change', (e) => {
    let src = e.target.files[0].name;
   _img.setAttribute('src', src)
    loadImage();
});


function loadImage() {
	var imgObj = new Image();

	imgObj.onload = function() {
        let r = _img.naturalWidth / _img.naturalHeight;

        if(r > 1 && _img.naturalWidth > 900) {
            _img.width = 900;
            _img.height = _img.width * _img.naturalHeight / _img.naturalWidth;
        } else if(_img.naturalHeight > 900) {
            _img.height = 600;
            _img.width = _img.height * _img.naturalWidth / _img.naturalHeight;
        } else {
            _img.width = _img.naturalWidth;
            _img.height = _img.naturalHeight;
        }
    
        _cw = _canvas.width = _img.width;
        _ch = _canvas.height = _img.height;    
        tileSize = _cw / tileCount

        // _pieceWidth = Math.floor(_cw / PUZZLE_DIFFICULTY)
        // _pieceHeight = Math.floor(_ch / PUZZLE_DIFFICULTY)
        console.log(tileSize, _pieceWidth, _pieceHeight)

		// _ctx.clearRect(0, 0, _cw, _ch);		
        // _ctx.drawImage(imgObj, 0, 0, _cw, _ch);	
        setBoard();
        drawTiles(imgObj);
    };    
    
	imgObj.src = _img.src;    
}

// To enable drag and drop
_canvas.addEventListener("dragover", function (evt) {
    _canvas.classList.add('active');
    
    evt.preventDefault();
}, false);

// To enable drag and drop
_canvas.addEventListener("dragleave", function (evt) {
    _canvas.classList.remove('active');

    evt.preventDefault();
}, false);

// Handle dropped image file
_canvas.addEventListener("drop", function (evt) {
    _canvas.classList.remove('active');
    
    var files = evt.dataTransfer.files;

    if (files.length > 0) {
        var file = files[0];
        if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
            var reader = new FileReader();
            // Note: addEventListener doesn't work in Google Chrome for this event
            reader.onload = function (evt) {
                _img.src = evt.target.result;
                loadImage();
            };
            reader.readAsDataURL(file);
        }
    }
    evt.preventDefault();
}, false);


function setBoard() {
    boardParts = new Array(tileCount);
    for (var i = 0; i < tileCount; ++i) {
        boardParts[i] = new Array(tileCount);
        for (var j = 0; j < tileCount; ++j) {
            boardParts[i][j] = new Object;
            boardParts[i][j].x = i;
            boardParts[i][j].y = j;
            // boardParts[i][j].x = (tileCount - 1) - i;
            // boardParts[i][j].y = (tileCount - 1) - j;
        }
    }
    emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
    emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
    solved = false;
}

function drawTiles(img) {
    imgLoaded = img;
    _ctx.clearRect(0, 0, _cw, _cw);
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = "#fff";

    for (var i = 0; i < tileCount; ++i) {
        for (var j = 0; j < tileCount; ++j) {
            var x = boardParts[i][j].x;
            var y = boardParts[i][j].y;
            let sx = x * tileSize;
            let sy = y * tileSize;
            let sWidth = tileSize;
            let sHeight = tileSize;
            let dx = i * tileSize;
            let dy = j * tileSize;
            let dWidth = tileSize;
            let dHeight = tileSize;
            if (i != emptyLoc.x || j != emptyLoc.y || solved == true) {
                // console.log(i, j, x, y)
                // console.log(sx, sy, sWidth, sHeight, dx, dy);
                _ctx.drawImage(imgLoaded, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            _ctx.strokeRect(dx, dy, dWidth, dHeight);
        }
    }
}

_canvas.onclick = function (e) {
    clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
    clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
    if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
        slideTile(emptyLoc, clickLoc);
        drawTiles(imgLoaded);
    }
    if (solved) {
        setTimeout(function () {
            alert("You solved it!");
        }, 500);
    }
};

function distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
    if (!solved) {
        boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
        boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
        boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
        boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
        toLoc.x = fromLoc.x;
        toLoc.y = fromLoc.y;
        checkSolved();
    }
}

function checkSolved() {
    var flag = true;
    for (var i = 0; i < tileCount; ++i) {
        for (var j = 0; j < tileCount; ++j) {
            if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
                flag = false;
            }
        }
    }
    solved = flag;
    if(solved) {
        console.log('solved')
    }
}