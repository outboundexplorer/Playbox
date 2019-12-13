
var editableDivNode;
var nodesForFormatting;
var fontUpright = false;
var cursorContainer = null;
var isSelecting = false;

var buttonNodes;


var TextGUI = (function(){

    var tGUI = {};

    tGUI.intialized = false;


    function init()
    {
        tGUI.id = 2;
    }

    function log()
    {
        console.log('2nd');
        console.log(tGUI.id);
    }

    function get()
    {
        return tGUI;
    }

    return {
        init: init,
        log: log,
        get:get
    }


})();
TextGUI.init();
//TextGUI();
console.log('3rd');
this.id = 3;
console.log(this.id);
TextGUI.log();

console.log(TextGUI.get());

function newProject(id){
    var _this = this;

    _this.id = id;
    _this.logit = logit;

    function logit(){
        console.log('_this',_this);
        console.log('_this.id',_this.id);
    }

}

var newP = new newProject('hello');

setTimeout(function(){
    newP.logit();
},5000);


var textGUI = null;



document.addEventListener('DOMContentLoaded', function() {
   //init();
    initProject();
});

function initProject(){
    textGUI = new textGUI$('tgui-box');
    initButtons();
}




function initButtons(){
    buttonNodes = document.querySelectorAll('.actionButton');
    registerButtonNodeHandlers();
}

function init(){
    editableDivNode = document.querySelector('#editable-div');
    editableDivNode.addEventListener('mousedown', handleMouseDown);
    editableDivNode.addEventListener('mouseup', handleMouseUp);
    editableDivNode.addEventListener('mouseout', handleMouseOut);
    editableDivNode.addEventListener('keyup', handleKeyUp);

    buttonNodes = document.querySelectorAll('.actionButton');
    registerButtonNodeHandlers();


}

function registerButtonNodeHandlers(){
    for (var i = 0,iLength = buttonNodes.length;i < iLength; i++){
        buttonNodes[i].onclick = handleActionButtonClick;
    }
}



function handleActionButtonClick(e) {
    console.log('button node', e.target.id);
    switch (e.target.id) {
        case 'directionToggle1':
            editableDivNode.style.writingMode = 'horizontal-tb';
            break;
        case 'directionToggle2':
            editableDivNode.style.writingMode = 'vertical-lr';
            break;
        case 'directionToggle3':
            editableDivNode.style.writingMode = 'vertical-rl';
            break;
        case 'directionToggle4':
            toggleOrientation();
            break;
        case 'leftAlign':
            formatParagraph('leftAlign');
            break;
        case 'centreAlign':
            formatParagraph('centerAlign');
            break;
        case 'rightAlign':
            formatParagraph('rightAlign');
            break;
        case 'doubleSpacing':
            formatParagraph('doubleSpacing');
            break;
        case 'directionToggle5':
            textGUI.applyColor('red');
            break;
        case 'directionToggle6':
            textGUI.applyColor('blue');
            break;
        case 'directionToggle7':
            textGUI.applyInlineFormat('bold');
            break;
        case 'directionToggle8':
            textGUI.applyDecoration('underline');
            break;
        case 'line-through':
            textGUI.applyDecoration('line-through');
            break;
        case 'large-font':
            textGUI.applyInlineFormat('large-font');
            break;
        case 'small-font':
            textGUI.applyInlineFormat('small-font');
            break;
        case 'directionToggle9':
            textGUI.applyInlineFormat('font');
            break;
        case 'directionToggle10':
            textGUI.generateFlattenedDiv();
            break;


    }
}




