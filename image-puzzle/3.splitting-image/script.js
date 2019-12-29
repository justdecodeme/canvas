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
clickLoc.r = 0;
clickLoc.c = 0;

var emptyLoc = new Object;
emptyLoc.r = 0;
emptyLoc.c = 0;

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

		// _ctx.clearRect(0, 0, _cw, _ch);		
        _ctx.drawImage(imgObj, 0, 0, _cw, _ch);	
        setBoard();
        setTimeout(() => {
        }, 1000);
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
    for (var r = 0; r < tileCount; ++r) {
        boardParts[r] = new Array(tileCount);
        for (var c = 0; c < tileCount; ++c) {
            boardParts[r][c] = new Object;

            boardParts[r][c].r = r;
            boardParts[r][c].c = c;
            // boardParts[r][c].r = (tileCount - 1) - r;
            // boardParts[r][c].c = (tileCount - 1) - c;
        }
    }
    emptyLoc.r = boardParts[tileCount - 1][tileCount - 1].r;
    emptyLoc.c = boardParts[tileCount - 1][tileCount - 1].c;
    // emptyLoc.x = 0;
    // emptyLoc.y = 0;
    solved = false;
    // console.log(boardParts, emptyLoc)
}

function drawTiles(img) {
    imgLoaded = img;
    _ctx.clearRect(0, 0, _cw, _cw);
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = "#fff";

    for (var r = 0; r < tileCount; ++r) {
        // console.log('row:...', r)
        for (var c = 0; c < tileCount; ++c) {
            var x = boardParts[r][c].c;
            var y = boardParts[r][c].r;
            let sx = x * tileSize;
            let sy = y * tileSize;
            let sWidth = tileSize;
            let sHeight = tileSize;
            let dx = c * tileSize;
            let dy = r * tileSize;
            let dWidth = tileSize;
            let dHeight = tileSize;
            // sy = dx = 200;
            // sx = dy = 0;
            console.log(sx, sy, dx, dy);
            if (r != emptyLoc.r || c != emptyLoc.c || solved == true) {
                // _ctx.drawImage(imgLoaded, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                // if(r == 0)
                _ctx.drawImage(imgLoaded, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            _ctx.strokeRect(dx, dy, dWidth, dHeight);
        }
    }
}

_canvas.onclick = function (e) {
    clickLoc.r = Math.floor((e.pageY - this.offsetTop) / tileSize);
    clickLoc.c = Math.floor((e.pageX - this.offsetLeft) / tileSize);
    // console.log(clickLoc.r, clickLoc.c, distance(clickLoc.r, clickLoc.c, emptyLoc.r, emptyLoc.c))
    if (distance(clickLoc.r, clickLoc.c, emptyLoc.r, emptyLoc.c) == 1) {
        slideTile(emptyLoc, clickLoc);
        drawTiles(imgLoaded);
    }
    if (solved) {
        // setTimeout(function () {
            console.log("You solved it!");
            setBoard()          
            drawTiles(imgLoaded)
        // }, 500);
    }
};

function distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
    if (!solved) {
        boardParts[toLoc.r][toLoc.c].r = boardParts[fromLoc.r][fromLoc.c].r;
        boardParts[toLoc.r][toLoc.c].c = boardParts[fromLoc.r][fromLoc.c].c;
        boardParts[fromLoc.r][fromLoc.c].r = tileCount - 1;
        boardParts[fromLoc.r][fromLoc.c].c = tileCount - 1;
        toLoc.r = fromLoc.r;
        toLoc.c = fromLoc.c;
        checkSolved();
    }
}

function checkSolved() {
    var flag = true;
    for (var r = 0; r < tileCount; ++r) {
        for (var c = 0; c < tileCount; ++c) {
            if (boardParts[r][c].r != r || boardParts[r][c].c != c) {
                flag = false;
            }
        }
    }
    solved = flag;
}