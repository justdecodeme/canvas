/*************************/
/* variables */
/*************************/
var canvas = document.getElementById('canvas');
var cw = canvas.width;
var ch = canvas.height;

var ctx = canvas.getContext('2d');
// draw text in center if no image is loaded
ctx.font = "20px Arial";
ctx.fillStyle = "grey";
ctx.textAlign = "center";
ctx.fillText("Drop an image onto the canvas", cw/2, ch/2);

var file = document.getElementById('file');
let img = document.getElementById('img');
var audio = document.getElementById("audio");

// sounds to play
var sounds = {
    'click': 'click.wav',
    'disable': 'disable.wav',
    'win': 'win.wav'
}


var tileCount = 3;
var tileWidth;
var tileHeight;

// location of click 
var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

// location of empty cell
var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

// flag for game state
var solved = false;

var boardParts;
var imgLoaded;


/*************************/
/* event listeners */
/*************************/
// detect if image is loaded through button
file.addEventListener("change", function (e) {
   let src = e.target.files[0].name;
   img.setAttribute('src', src)
   loadImage();
});

// detect click on canvas
canvas.addEventListener("click", function (e) {

    clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileWidth);
    clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileHeight);

    if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
        playAudio(sounds.click);
        slideTile(emptyLoc, clickLoc);
        drawTiles(imgLoaded);
    } else {
        playAudio(sounds.disable);
    }
    if (solved) {
        playAudio(sounds.win);
        setTimeout(function () {
            alert("You solved it!");
        }, 1000);
    }
});

// check if mouse is over the canvas
canvas.addEventListener("dragover", function (evt) {
    canvas.classList.add('active');
    
    evt.preventDefault();
}, false);

// check if mouse leave the canvas
canvas.addEventListener("dragleave", function (evt) {
    canvas.classList.remove('active');

    evt.preventDefault();
}, false);

// handle dropped image file
canvas.addEventListener("drop", function (evt) {
    canvas.classList.remove('active');
    
    var files = evt.dataTransfer.files;

    if (files.length > 0) {
        var file = files[0];
        if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
            var reader = new FileReader();
            // Note: addEventListener doesn't work in Google Chrome for this event
            reader.onload = function (evt) {
                img.src = evt.target.result;
                loadImage();
            };
            reader.readAsDataURL(file);
        }
    }
    evt.preventDefault();
}, false);


/*************************/
/* functions */
/*************************/
// load image and calculate canvas width and height as per image dimensions
function loadImage() {
	var imgObj = new Image();

	imgObj.onload = function() {
        let r = img.naturalWidth / img.naturalHeight;

        if(r > 1 && img.naturalWidth > 900) {
            img.width = 900;
            img.height = img.width * img.naturalHeight / img.naturalWidth;
        } else if(img.naturalHeight > 900) {
            img.height = 600;
            img.width = img.height * img.naturalWidth / img.naturalHeight;
        } else {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;
        }
    
        cw = canvas.width = img.width;
        ch = canvas.height = img.height;    
        tileWidth = cw / tileCount;
        tileHeight = ch / tileCount;

        setBoard();
        // setTimeout(() => {
            drawTiles(imgObj);
        // }, 1000);
    };    
    
	imgObj.src = img.src;    
}

// set board object to save the state of the game
function setBoard() {
    boardParts = new Array(tileCount); 
    for (var i = 0; i < tileCount; ++i) {
        boardParts[i] = new Array(tileCount);
        for (var j = 0; j < tileCount; ++j) {
            boardParts[i][j] = new Object;
            boardParts[i][j].x = i;
            boardParts[i][j].y = j;
        }
    }
    initTiles();
    initEmpty();
    if (!isSolvable(tileCount, tileCount, emptyLoc.y + 1)) {
        if (emptyLoc.y == 0 && emptyLoc.x <= 1) {
            swapTiles(tileCount - 2, tileCount - 1, tileCount - 1, tileCount - 1);
        } else {
            swapTiles(0, 0, 1, 0);
        }
        initEmpty();
    }
    solved = false;
}

// draw the image tile over the canvas
function drawTiles(img) { 
    imgLoaded = img;
    ctx.clearRect(0, 0, cw, ch);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";

    for (var i = 0; i < tileCount; ++i) {
        for (var j = 0; j < tileCount; ++j) {
            var x = boardParts[i][j].x;
            var y = boardParts[i][j].y;

            let sx = x * tileWidth;
            let sy = y * tileHeight;
            let sWidth = tileWidth;
            let sHeight = tileHeight;
            let dx = i * tileWidth;
            let dy = j * tileHeight;
            let dWidth = tileWidth;
            let dHeight = tileHeight;
            
            ctx.strokeRect(dx, dy, dWidth, dHeight);
            // console.log(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

            if (i != emptyLoc.x || j != emptyLoc.y || solved == true) {
                ctx.drawImage(imgLoaded, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
    }
}

// calculate the distance between clicked tile and empty tile
function distance(x1, y1, x2, y2) {
    console.log(Math.abs(x1 - x2) + Math.abs(y1 - y2));
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// slide the clicked tile to empty loaction
function slideTile(emptyLoc, clickLoc) {
    if (!solved) {
        // swapping 
        boardParts[emptyLoc.x][emptyLoc.y].x = boardParts[clickLoc.x][clickLoc.y].x;
        boardParts[emptyLoc.x][emptyLoc.y].y = boardParts[clickLoc.x][clickLoc.y].y;

        
        // 9 number is missing, so puzzle is not possible to finish if we don't click last tile (2,2).
        // that's why after SWAPPING we are updating clicked position to last tile since we can't slide last tile any way.
        boardParts[clickLoc.x][clickLoc.y].x = tileCount - 1; // 2
        boardParts[clickLoc.x][clickLoc.y].y = tileCount - 1; // 2

        // updating empty location to clicked location
        emptyLoc.x = clickLoc.x; 
        emptyLoc.y = clickLoc.y;  
        
        checkSolved();
    }
}

// check if puzzle is solved or not
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
}

// play sound effect
function playAudio(src) {
    // var a = new Audio(src);
    audio.src = src;
    // Show loading animation.
    var playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
        })
        .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        });
    }    
}


/***********************************/
/* generate random tiles algoriths */
/***********************************/
function initTiles() {
    var i = tileCount * tileCount - 1;
    while (i > 0) {
        var j = Math.floor(Math.random() * i);
        var xi = i % tileCount;
        var yi = Math.floor(i / tileCount);
        var xj = j % tileCount;
        var yj = Math.floor(j / tileCount);
        swapTiles(xi, yi, xj, yj);
        --i;
    }

}
function swapTiles(i, j, k, l) {
    var temp = new Object();
    temp = boardParts[i][j];
    boardParts[i][j] = boardParts[k][l];
    boardParts[k][l] = temp;
}
function isSolvable(width, height, emptyRow) {
    if (width % 2 == 1) {
        return (sumInversions() % 2 == 0)
    } else {
        return ((sumInversions() + height - emptyRow) % 2 == 0)
    }
}
function sumInversions() {
    var inversions = 0;
    for (var j = 0; j < tileCount; ++j) {
        for (var i = 0; i < tileCount; ++i) {
            inversions += countInversions(i, j);
        }
    }
    return inversions;
}
function countInversions(i, j) {
    var inversions = 0;
    var tileNum = j * tileCount + i;
    var lastTile = tileCount * tileCount;
    var tileValue = boardParts[i][j].y * tileCount + boardParts[i][j].x;
    for (var q = tileNum + 1; q < lastTile; ++q) {
        var k = q % tileCount;
        var l = Math.floor(q / tileCount);

        var compValue = boardParts[k][l].y * tileCount + boardParts[k][l].x;
        if (tileValue > compValue && tileValue != (lastTile - 1)) {
            ++inversions;
        }
    }
    return inversions;
}
function initEmpty() {
    for (var j = 0; j < tileCount; ++j) {
        for (var i = 0; i < tileCount; ++i) {
            if (boardParts[i][j].x == tileCount - 1 && boardParts[i][j].y == tileCount - 1) {
                emptyLoc.x = i;
                emptyLoc.y = j;
            }
        }
    }
}