function Pixelart(element, row, col) {
    this.activeColor = '#000';
    this.eraserColor = '#fff';
    this.isEraserEnabled = false;
    this.rootElement = document.querySelector(element);
    this.row = row;
    this.col = col;
    this.cellTrack = [];
    this.cellCount = 1;
    this.iseyeDropperEnabled = false;

    this.init();
    this.bindEvent();
    this.leftBar();
}

Pixelart.prototype.init = function() {
    document.querySelector('#height').value = Number(this.row);
    document.querySelector('#width').value = Number(this.col);
    this.rootElement.innerHTML = '';
    let fragmentElement = document.createDocumentFragment();
    for(let i=0;i<this.row;i++) {
        let rowElement = document.createElement('div');
        rowElement.classList.add('row');
        for(let j=0;j<this.col;j++) {
            let colElement = document.createElement('div');
            colElement.classList.add('cell');
            colElement.dataset['cord']=`col-${i}-${j}`;
            rowElement.appendChild(colElement);
        }
        fragmentElement.appendChild(rowElement)
    }
    this.rootElement.appendChild(fragmentElement)
}

Pixelart.prototype.bindEvent = function() {
    let context = this;
    let isMouseClick = false;
    this.rootElement.addEventListener('mousedown', function(event){
        isMouseClick = true;
        context.cellTrack.length = context.cellCount;
        if(event.target.dataset['cord']) {
            // Eyedropper Logic
            context.iseyeDropperEnabled && (context.activeColor = event.target.style.backgroundColor)
            context.iseyeDropperEnabled &&(document.querySelector('#colorpicker').value = rgb2hex(event.target.style.backgroundColor)) 
            context.iseyeDropperEnabled &&(document.querySelector('#colorpicker').style.backgroundColor = event.target.style.backgroundColor) 
            context.iseyeDropperEnabled && (context.iseyeDropperEnabled = false);
            // Eraser logic
            event.target.style.backgroundColor = context.isEraserEnabled?context.eraserColor :context.activeColor;
            // cell Track
            let rowColValue = event.target.dataset['cord'].split('-');
            context.userTrack(rowColValue[1], rowColValue[2],context.cellCount);
            context.cellCount++;
        }
    });
    this.rootElement.addEventListener('mouseover', function(event){
        let rowColElement = event.target.dataset['cord'];
        let rowColValue;
        if(rowColElement !== undefined) {
            rowColValue = rowColElement.split('-');
            document.querySelector('#rownum').innerText = rowColValue[1];
            document.querySelector('#colnum').innerText = rowColValue[2];
        }
        if(isMouseClick) {
            event.target.style.backgroundColor = context.isEraserEnabled?context.eraserColor :context.activeColor
            context.userTrack(rowColValue[1], rowColValue[2], context.cellCount);
            context.cellCount++;
        }
        
    });
    this.rootElement.addEventListener('mouseup', function(event){
        isMouseClick = false;
    });

    document.querySelector('.rightbar').addEventListener('click', function(event){
        if(event.target.dataset['resize']) {
            context.row = Number(document.querySelector('#height').value);
            context.col = Number(document.querySelector('#width').value);
            context.cellTrack = [];
            context.cellCount = 0;
            context.init()
        }

        if(event.target.dataset['themecolor']) {
            document.querySelector('.leftbar').style.backgroundColor = event.target.style.backgroundColor;
            document.querySelector('.rightbar--draw-button').style.backgroundColor = event.target.style.backgroundColor;
            document.querySelectorAll('.btn-custom').forEach(element => element.style.backgroundColor = event.target.style.backgroundColor);
        }

        if(event.target.dataset['cellcolor']) {
            context.activeColor = event.target.dataset['cellcolor'];
            document.querySelectorAll('#colorpicker').forEach(element => {
                element.value = context.activeColor;
                element.style.backgroundColor = context.activeColor;
            })
        }

        if(event.target.dataset['customcolor']){
            console.log(event.target.value);
        }

        if(event.target.dataset['frame']==='circle') {
            document.querySelector('.rightbar--frames__circle').style.backgroundColor = '#000';
            document.querySelector('.rightbar--frames__box').style.backgroundColor = '#fff';
            document.querySelectorAll('.cell').forEach(value => value.classList.add('cell-rounded'))
        }
        if(event.target.dataset['frame']==='box') {
            document.querySelector('.rightbar--frames__box').style.backgroundColor = '#000';
            document.querySelector('.rightbar--frames__circle').style.backgroundColor = '#fff';
            document.querySelectorAll('.cell').forEach(value => value.classList.remove('cell-rounded'))
        }
    })

    document.querySelector('#colorpicker').addEventListener('input', function(event){
        context.activeColor = event.target.value;
        event.target.style.backgroundColor = event.target.value;
    })

    document.querySelector('#widthrange').addEventListener('input', function(event) {
        context.rootElement.style.width = `${event.target.value}%`;
        context.rootElement.style.height = `${event.target.value}%`;
    })
}

Pixelart.prototype.leftBar = function() {
    let leftbar = document.querySelector('.leftbar');
    let context = this;
    leftbar.addEventListener('click', function(event){
        let menuItem = event.target.dataset['menu'];
        switch(menuItem) {
            case 'eraser':
                context.isEraserEnabled = true;
                document.body.style.cursor = "url('./eraser.png'), default";
                break;
            case 'edit':
                context.isEraserEnabled = false;
                document.body.style.cursor = "url('./pencil.png'), default";
                break;
            case 'togglegrid':
                if(context.rootElement.classList.contains('mainboard-outline')) {
                    context.rootElement.classList.remove('mainboard-outline');
                } else {
                    context.rootElement.classList.add('mainboard-outline');
                }
                break;
            case 'clear':
                document.querySelectorAll('div[data-cord]').forEach(value => value.style.backgroundColor='');
                context.cellTrack = [];
                context.cellCount = 0;
                break;
            case 'download':
                context.downloadGrid();
                break;
            case 'undo':
                context.undo();
                break;
            case 'redo':
                context.redo();
                break;
            case 'eyedropper':
                context.eyeDropper();
                break;
            default:
                context.printTrack();
                context.animate();
        }
    })
}

Pixelart.prototype.downloadGrid = function() {
    html2canvas(this.rootElement).then(canvas => {
        canvas.toBlob(function(blob){ saveAs(blob,"pixelart.png"); });
    });
}

Pixelart.prototype.eyeDropper = function() {
   this.iseyeDropperEnabled = true;
}


Pixelart.prototype.userTrack = function(row, col, id) {
    let newData = {
        id: id,
        row: row,
        col: col
    }
    console.log(newData)
    this.cellTrack.push(newData);
}

Pixelart.prototype.printTrack = function(){
    console.log(this.cellTrack)
    console.log(this.cellCount)
}

Pixelart.prototype.undo = function(){
    if(this.cellCount >= 1){
        this.cellCount--;
        this.cellTrack.forEach(value => {
            if(value.id === this.cellCount) {
                document.querySelector(`[data-cord='col-${value.row}-${value.col}']`).style.backgroundColor = "";
            }
        })
    }
}

Pixelart.prototype.redo = function(){
    if(this.cellTrack.length > this.cellCount) {
        this.cellTrack.forEach(value => {
            if(value.id === this.cellCount) {
                document.querySelector(`[data-cord='col-${value.row}-${value.col}']`).style.backgroundColor = this.activeColor;
            }
        })
        this.cellCount++;
    }
}

Pixelart.prototype.animate = function(){
    document.querySelectorAll('div[data-cord]').forEach(value => value.style.backgroundColor='');
    let context = this;
    setTimeout(function(){
        context.cellTrack.forEach(value => document.querySelector(`[data-cord='col-${value.row}-${value.col}']`).style.backgroundColor = context.activeColor)
        // this.cellTrack.forEach(value => console.log(value))
    }, 2000)
    
}




// Initilaize Pixelart
new Pixelart('.mainboard', 3, 3);

// Convert rgb to hex
var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }