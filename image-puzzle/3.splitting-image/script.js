const PUZZLE_DIFFICULTY = 4;
var _canvas = document.getElementById('canvas');
var _cw = _canvas.width, _ch = _canvas.height;
var _ctx = _canvas.getContext('2d');
var _file = document.getElementById('file');
let _img = document.getElementById('img')
var _pieceWidth;
var _pieceHeight;

_ctx.font = "20px Arial";
_ctx.fillStyle = "grey";
_ctx.textAlign = "center";
_ctx.fillText("Drop an image onto the canvas", _cw/2, _ch/2);


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

        _pieceWidth = Math.floor(_cw / PUZZLE_DIFFICULTY)
        _pieceHeight = Math.floor(_ch / PUZZLE_DIFFICULTY)
        console.log(_pieceWidth, _pieceHeight)

		_ctx.clearRect(0, 0, _cw, _ch);		
		_ctx.drawImage(imgObj, 0, 0, _cw, _ch);	
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


