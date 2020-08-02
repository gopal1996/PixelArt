function Pixelart(element, row, col) {
    this.activeColor = '#000';
    this.eraserColor = '#fff';
    this.isEraserEnabled = false;
    this.isMouseClick = false;
    this.isGameMenuEnabled = false;
    this.rootElement = document.querySelector(element);
    this.row = row;
    this.col = col;
    this.score = 0;
    this.cellTrack = [];
    this.boundMouseUpListener = mouseUpListener.bind(this)
    this.boundMouseOverListener = mouseOverListener.bind(this)
    this.boundMouseDownListener = mouseDownListener.bind(this)
    this.boundGameMouseDownListener = gameMouseDown.bind(this)
    this.cellCount = 1;
    this.iseyeDropperEnabled = false;

    this.init();
    this.bindEvent();
    this.leftBar();
    this.bindRightMenu();
    this.bindcolorPicker();
    this.bindGridWidth();
    this.mobileDrag();
}

Pixelart.prototype.init = function() {
    document.querySelector('#height').value = Number(this.row);
    document.querySelector('#width').value = Number(this.col);
    let { color, oddColor } = this.generateRandomColor();
    this.rootElement.innerHTML = '';
    let fragmentElement = document.createDocumentFragment();
    for(let i=0;i<this.row;i++) {
        let rowElement = document.createElement('div');
        rowElement.classList.add('row');
        for(let j=0;j<this.col;j++) {
            let colElement = document.createElement('div');
            colElement.classList.add('cell');
            // Game logic
            if(this.isGameMenuEnabled){
                colElement.dataset['gamecell'] = "wrong";
                colElement.style.backgroundColor = color;
            }

            colElement.dataset['cord']=`col-${i}-${j}`;
            rowElement.appendChild(colElement);
        }
        fragmentElement.appendChild(rowElement)
    }
    this.rootElement.appendChild(fragmentElement)
    this.isGameMenuEnabled && this.addOddColorCell(oddColor);
}


function mouseDownListener(event){
    console.log(this)
    this.isMouseClick = true;
    this.cellTrack.length = this.cellCount;
    if(event.target.dataset['cord']) {
        // Eyedropper Logic
        this.iseyeDropperEnabled && this.eyedropper(event.target.style.backgroundColor)
        
        // Eraser logic
        event.target.style.backgroundColor = this.isEraserEnabled?this.eraserColor : this.activeColor;

        // cell Track
        let rowColValue = event.target.dataset['cord'].split('-');
        this.userTrack(rowColValue[1], rowColValue[2],this.cellCount,event.target.style.backgroundColor);
        this.cellCount++;
    }
}

function mouseOverListener(event){
    let rowColElement = event.target.dataset['cord'];
    let rowColValue;
    if(rowColElement !== undefined) {
        rowColValue = rowColElement.split('-');
        document.querySelector('#rownum').innerText = rowColValue[1];
        document.querySelector('#colnum').innerText = rowColValue[2];
    }
    if(this.isMouseClick) {
        // Eraser Logic
        event.target.style.backgroundColor = this.isEraserEnabled?this.eraserColor : this.activeColor;

        // Cell Track
        this.userTrack(rowColValue[1], rowColValue[2], this.cellCount,event.target.style.backgroundColor);
        this.cellCount++;
    }
}

function mouseUpListener(event){
    this.isMouseClick = false;
}

Pixelart.prototype.bindEvent = function() {
    this.rootElement.addEventListener('mousedown', this.boundMouseDownListener);
    this.rootElement.addEventListener('mouseover', this.boundMouseOverListener);
    this.rootElement.addEventListener('mouseup', this.boundMouseUpListener);
    
}

// Remove Bind Event

Pixelart.prototype.removeBindEvent = function() {
    this.rootElement.removeEventListener('mousedown', this.boundMouseDownListener);
    this.rootElement.removeEventListener('mouseover', this.boundMouseOverListener);
    this.rootElement.removeEventListener('mouseup', this.boundMouseUpListener); 
}

function gameMouseDown(event){
    let target = event.target.dataset['gamecell'];
    if(target === 'correct'){
        this.score++;
        this.col++;
        this.row++;
        this.resetGrid();
        this.setScore();
        this.init();
    }else{
        this.rootElement.classList.add('shake');
        setTimeout(function(){
            this.rootElement.classList.remove('shake');
            this.score = 0;
            this.col = 4;
            this.row = 4;
            this.resetGrid();
            this.setScore();
            this.init();
        }.bind(this), 800)
    }
}

Pixelart.prototype.addBindGameEvent = function() {
    this.rootElement.addEventListener('mousedown', this.boundGameMouseDownListener)
}

Pixelart.prototype.removeBindGameEvent = function() {
    this.rootElement.addEventListener('mousedown', this.boundGameMouseDownListener)
}

Pixelart.prototype.setScore = function(){
    // document.querySelector('.score').innerHTML = this.score;
}

Pixelart.prototype.resetGrid = function(){
    this.rootElement.innerHTML = '';
}

Pixelart.prototype.getRandomCell = function() {
    console.log(this.row)
    let row = Math.floor(Math.random() * Number(this.row));
    let col = Math.floor(Math.random() * Number(this.col));
    console.log(col)
	return {
        row, col
    }
}

Pixelart.prototype.addOddColorCell = function(oddColor) {
    
    let row = this.getRandomCell();
    // console.log(row);
    // console.log(this.getRandomCell())
    // let uniqueCell = document.querySelector(`div[data-cord='${row}-${col}']`);
    // uniqueCell.dataset['gamecell']="correct";
    // uniqueCell.style.backgroundColor = oddColor;
}


Pixelart.prototype.mobileDrag = function(){
    try {
        this.rootElement.addEventListener('touchmove', function(event){
            let touchElement = document.elementFromPoint(event.targetTouches[0].clientX, event.targetTouches[0].clientY)
            let rowColElement = touchElement.dataset['cord']
            let rowColValue;
            if(rowColElement !== undefined) {
                rowColValue = rowColElement.split('-');
                document.querySelector('#rownum').innerText = rowColValue[1];
                document.querySelector('#colnum').innerText = rowColValue[2];
    
                // Eraser Logic
                touchElement.style.backgroundColor = this.isEraserEnabled?this.eraserColor : this.activeColor;
    
                // Cell Track
                this.userTrack(rowColValue[1], rowColValue[2], this.cellCount,touchElement.style.backgroundColor);
                this.cellCount++;
            }
            
            
        })
    } catch (error) {
        
    }
    
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
        console.log(menuItem)
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
            case 'game':
                document.querySelector('.active').classList.remove('active');
                context.isGameMenuEnabled = true;
                context.infinityGame();
                document.querySelector('.leftbar--logo').classList.add('active');
                break;
            default:
                context.printTrack();
                // context.animate();
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
    this.cellTrack.push(newData);
}

Pixelart.prototype.printTrack = function(){
    // console.log(this.cellTrack)
    // console.log(this.cellCount)
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

// Fun Game

Pixelart.prototype.infinityGame = function(){
    this.row = 4;
    this.col = 4;
    this.init();
    this.removeBindEvent();
    this.addBindGameEvent();
}

Pixelart.prototype.generateRandomColor = function() {
    let ratio = 0.618033988749895;

    let hue = (Math.random() + ratio) % 1;
    let saturation = Math.round(Math.random() * 100) % 85;
    let lightness = Math.round(Math.random() * 100) % 85;

    let color = 'hsl(' + Math.round(360 * hue) + ',' + saturation + '%,' + lightness + '%)';
    let oddColor = 'hsl(' + Math.round(360 * hue) + ',' + saturation + '%,' + (lightness + 5) + '%)';

    return {
        color,
        oddColor
    }
}

Pixelart.prototype.getRandomCell = function() {
	return Math.floor(Math.random() * this.size)
}



// Initilaize Pixelart
var startApp = new Pixelart('.mainboard', 20, 20);

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