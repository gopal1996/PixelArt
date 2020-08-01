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
    this.bindRightMenu();
    this.bindcolorPicker();
    this.bindGridWidth();
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
            context.iseyeDropperEnabled && context.eyedropper(event.target.style.backgroundColor)
            
            // Eraser logic
            event.target.style.backgroundColor = context.isEraserEnabled?context.eraserColor : context.activeColor;

            // cell Track
            let rowColValue = event.target.dataset['cord'].split('-');
            context.userTrack(rowColValue[1], rowColValue[2],context.cellCount,event.target.style.backgroundColor);
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
            // Eraser Logic
            event.target.style.backgroundColor = context.isEraserEnabled?context.eraserColor : context.activeColor;

            // Cell Track
            context.userTrack(rowColValue[1], rowColValue[2], context.cellCount,event.target.style.backgroundColor);
            context.cellCount++;
        }
        
    });

    this.rootElement.addEventListener('mouseup', function(event){
        isMouseClick = false;
    });


    
}

Pixelart.prototype.bindcolorPicker = function(){
    document.querySelector('#colorpicker').addEventListener('input', function(event){
        this.activeColor = event.target.value;
        event.target.style.backgroundColor = event.target.value;
    }.bind(this))
}

Pixelart.prototype.bindGridWidth = function(){
    document.querySelector('#widthrange').addEventListener('input', function(event) {
        this.rootElement.style.width = `${event.target.value}%`;
        this.rootElement.style.height = `${event.target.value}%`;
    }.bind(this))
}


Pixelart.prototype.bindRightMenu = function(){
    
    // right menu
    document.querySelector('.rightbar').addEventListener('click', function(event){
        if(event.target.dataset['resize']) {
           this.resizeGrid();
        }

        if(event.target.dataset['themecolor']) {
            this.setTheme(event.target.style.backgroundColor);
        }

        if(event.target.dataset['cellcolor']) {
            this.setActiveColor(event.target.dataset['cellcolor'])
        }

        if(event.target.dataset['customcolor']){
            console.log(event.target.value);
        }

        // set Frame
        event.target.dataset['frame'] && this.setFrame(event.target.dataset['frame']);
    }.bind(this))
}

// set Frame
Pixelart.prototype.setFrame = function(frame){
    let circleFrame = document.querySelector('.rightbar--frames__circle');
    let boxFrame = document.querySelector('.rightbar--frames__box');
    if(frame === 'circle') {
        circleFrame.style.backgroundColor = '#000';
        boxFrame.style.backgroundColor = '#fff';
        document.querySelectorAll('.cell').forEach(value => value.classList.add('cell-rounded'))
    } else {
        boxFrame.style.backgroundColor = '#000';
        circleFrame.style.backgroundColor = '#fff';
        document.querySelectorAll('.cell').forEach(value => value.classList.remove('cell-rounded'))
    }
}

// Set active color
Pixelart.prototype.setActiveColor = function(color){
    this.activeColor = color;
    document.querySelectorAll('#colorpicker').forEach(element => {
        element.value = this.activeColor;
        element.style.backgroundColor = this.activeColor;
    })
}

// set Theme
Pixelart.prototype.setTheme = function(backgroundColor){
    document.querySelector('.leftbar').style.backgroundColor = backgroundColor;
    document.querySelector('.rightbar--draw-button').style.backgroundColor = backgroundColor;
    document.querySelectorAll('.btn-custom').forEach(element => element.style.backgroundColor = backgroundColor);
}

// Resize Logic
Pixelart.prototype.resizeGrid = function(){
    this.row = Number(document.querySelector('#height').value);
    this.col = Number(document.querySelector('#width').value);
    this.cellTrack = [];
    this.cellCount = 0;
    this.init()
}

// Eye Dropper Logic
Pixelart.prototype.eyedropper = function(backgroundColor) {
    this.setActiveColor(rgb2hex(backgroundColor))
    this.iseyeDropperEnabled = false
}

Pixelart.prototype.leftBar = function() {
    let leftbar = document.querySelector('.leftbar');
    let context = this;
    leftbar.addEventListener('click', function(event){
        let menuItem = event.target.dataset['menu'];
        switch(menuItem) {
            case 'eraser':
                document.querySelector('.active').classList.remove('active');
                context.isEraserEnabled = true;
                document.body.style.cursor = "url('./eraser.png'), default";
                document.querySelector('.leftbar--eraser').classList.add('active');
                break;
            case 'edit':
                document.querySelector('.active').classList.remove('active');
                context.isEraserEnabled = false;
                document.body.style.cursor = "url('./pencil.png'), default";
                document.querySelector('.leftbar--edit').classList.add('active');
                break;
            case 'togglegrid':
                document.querySelector('.active').classList.remove('active');
                if(context.rootElement.classList.contains('mainboard-outline')) {
                    context.rootElement.classList.remove('mainboard-outline');
                } else {
                    context.rootElement.classList.add('mainboard-outline');
                }
                document.querySelector('.leftbar--togglegrid').classList.add('active');
                setTimeout(function(){
                    document.querySelector('.leftbar--togglegrid').classList.remove('active');
                    document.querySelector('.leftbar--edit').classList.add('active');
                    context.isEraserEnabled = false;
                    document.body.style.cursor = "url('./pencil.png'), default";
                },800)
                
                break;
            case 'clear':
                document.querySelector('.active').classList.remove('active');
                document.querySelectorAll('div[data-cord]').forEach(value => value.style.backgroundColor='');
                context.cellTrack = [];
                context.cellCount = 0;
                
                document.querySelector('.leftbar--clear').classList.add('active');
                setTimeout(function(){
                    document.querySelector('.leftbar--clear').classList.remove('active');
                    document.querySelector('.leftbar--edit').classList.add('active');
                    context.isEraserEnabled = false;
                    document.body.style.cursor = "url('./pencil.png'), default";
                },800)
                
                break;
            case 'download':
                document.querySelector('.active').classList.remove('active');
                context.downloadGrid();
                document.querySelector('.leftbar--download').classList.add('active');
                setTimeout(function(){
                    document.querySelector('.leftbar--download').classList.remove('active');
                    context.isEraserEnabled = false;
                    document.querySelector('.leftbar--edit').classList.add('active');
                    document.body.style.cursor = "url('./pencil.png'), default";
                },500)
                break;
            case 'undo':
                document.querySelector('.active').classList.remove('active');
                context.undoMenu();
                document.querySelector('.leftbar--undo').classList.add('active');
                setTimeout(function(){
                    document.querySelector('.leftbar--undo').classList.remove('active');
                    context.isEraserEnabled = false;
                    document.querySelector('.leftbar--edit').classList.add('active');
                    document.body.style.cursor = "url('./pencil.png'), default";
                },500)
                break;
            case 'redo':
                document.querySelector('.active').classList.remove('active');
                context.redoMenu();
                document.querySelector('.leftbar--redo').classList.add('active');
                setTimeout(function(){
                    document.querySelector('.leftbar--redo').classList.remove('active');
                    context.isEraserEnabled = false;
                    document.querySelector('.leftbar--edit').classList.add('active');
                    document.body.style.cursor = "url('./pencil.png'), default";
                },500)
                break;
            case 'eyedropper':
                document.querySelector('.active').classList.remove('active');
                context.eyeDropperMenu();
                document.querySelector('.leftbar--eyedropper').classList.add('active');
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

Pixelart.prototype.eyeDropperMenu = function() {
   this.iseyeDropperEnabled = true;
}


Pixelart.prototype.userTrack = function(row, col, id, backgroundColor) {
    let newData = {
        id: id,
        row: row,
        col: col,
        backgroundColor: backgroundColor
    }
    console.log(newData)
    this.cellTrack.push(newData);
}

Pixelart.prototype.printTrack = function(){
    console.log(this.cellTrack)
    console.log(this.cellCount)
}

Pixelart.prototype.undoMenu = function(){
    if(this.cellCount >= 1){
        this.cellCount--;
        this.cellTrack.forEach(value => {
            if(value.id === this.cellCount) {
                document.querySelector(`[data-cord='col-${value.row}-${value.col}']`).style.backgroundColor = "";
            }
        })
    }
}

Pixelart.prototype.redoMenu = function(){
    if(this.cellTrack.length > this.cellCount) {
        this.cellTrack.forEach(value => {
            if(value.id === this.cellCount) {
                document.querySelector(`[data-cord='col-${value.row}-${value.col}']`).style.backgroundColor = value.backgroundColor;
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
new Pixelart('.mainboard', 20, 20);

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