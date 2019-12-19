function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}


window.onload = function() {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    canvas.id = "canvas_id";
    canvas.className = "canvas";                  // should be className
    canvas.height = 400;                          // should be numbers
    canvas.width = 800;
    var image = new Image();
    image.onload = function() {
        // or set canvas size = image, here: (this = currently loaded image)
        // canvas.width = this.width;
        // canvas.height = this.height;
        context.drawImage(this, 0, 0);              // draw at (0,0), size = image size

        // or, if you want to fill the canvas independent on image size:
        // context.drawImage(this, 0, 0, canvas.width, canvas.height);
    }
    // set src last (recommend to use relative paths where possible)
    image.src = "http://lorempixel.com/output/fashion-q-c-800-400-7.jpg";
    document.body.appendChild(canvas);
};

document.addEventListener('DOMContentLoaded',initListeners);

function initListeners(){
    document.querySelector('#copy-canvas').addEventListener('click',copyCanvas);
    document.querySelector('#rotate-canvas').addEventListener('click',rotateCanvas);
}

function copyCanvas(){
    var miniCanvas = cloneCanvas(document.querySelector('#canvas_id'));
    var miniContext = miniCanvas.getContext('2d');

    // create a temporary canvas obj to cache the pixel data //
    var temp_cnvs = document.createElement('canvas');
    var temp_cntx = temp_cnvs.getContext('2d');

    // set it to the new width & height and draw the current canvas data into it //
    temp_cnvs.width = 160;
    temp_cnvs.height = 80;

    // temp_cntx.fillStyle = _background;  // the original canvas's background color
    temp_cntx.fillRect(0, 0, 160, 80);
    temp_cntx.scale(0.2,0.2);
    temp_cntx.drawImage(miniCanvas, 0, 0);
    // miniCanvas.height = 200;
    // miniCanvas.width = 400;
    miniCanvas.width = 160;
    miniCanvas.height = 80;
    miniContext.drawImage(temp_cnvs, 0, 0);
    document.body.appendChild(miniCanvas);
}

function rotateCanvas(){
    var canvas = document.getElementById('canvas_id');
    var context = canvas.getContext('2d');

    // translate context to center of canvas
    context.translate(canvas.width / 2, canvas.height / 2);

    // rotate 45 degrees clockwise
    context.rotate(Math.PI / 4);

    context.drawImage(canvas,0,0);
}
