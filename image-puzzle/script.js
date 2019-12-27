var _canvas = document.getElementById('canvas');
var _ctx = _canvas.getContext('2d');
var _file = document.getElementById('file');
let _img = document.getElementById('img')


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
    
        _canvas.width = _img.width;
        _canvas.height = _img.height;    

		_ctx.clearRect(0, 0, _canvas.width, _canvas.height);		
		_ctx.drawImage(imgObj, 0, 0, _canvas.width, _canvas.height);	
    };    
    
	imgObj.src = _img.src;    
}
