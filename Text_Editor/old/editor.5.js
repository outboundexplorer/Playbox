
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
    textGUI = new textGUI$('editable-div');
    initButtons();

}


function textGUI$(pElementID){
    var _this = this;

    var textProps = {
        editableDivNode :null,
        isSelecting: false,
        nodesForFormatting: null,
        cursorContainer: null,
        fontUpright: false
    };

    initGUI();

    function initGUI(){
        defineBox();
        registerListeners();
    }

    /***** Private functions *****/
    function defineBox(){
        textProps.editableDivNode = document.querySelector('#'+pElementID);
    }

    function registerListeners(){
        textProps.editableDivNode.addEventListener('mousedown', handleMouseDown);
        textProps.editableDivNode.addEventListener('mouseup', handleMouseUp);
        textProps.editableDivNode.addEventListener('mouseout', handleMouseOut);
        textProps.editableDivNode.addEventListener('keyup', handleKeyUp);
    }

    function handleMouseUp(event) {
        textProps.isSelecting = false;
        console.log('mouseupHandler() -- event', event);
        setNodesForFormatting(event);
    }

    function handleMouseOut(event) {
        if(textProps.isSelecting){
            console.log('mouseupHandler() -- event', event);
            setNodesForFormatting(event);
        }
    }

    function handleMouseDown(event) {
        textProps.isSelecting = true;
    }

    function handleKeyUp(event) {
        console.log('handleKeyUp()) -- event', event);
        //if (isInvalidMouseUp(event.target)) {
        //  return;
        //}
        if(event.keyCode === 13){
            console.log('handle return -- event',event);
            applySiblingDivFormatToNewDiv();
        }
        setNodesForFormatting(event);
    }
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
            applyInlineFormat('red');
            break;
        case 'directionToggle6':
            applyInlineFormat('blue');
            break;
        case 'directionToggle7':
            applyInlineFormat('bold');
            break;
        case 'directionToggle8':
            applyInlineFormat('underline');
            break;
        case 'line-through':
            applyInlineFormat('line-through');
            break;
        case 'large-font':
            applyInlineFormat('large-font');
            break;
        case 'small-font':
            applyInlineFormat('small-font');
            break;
        case 'directionToggle9':
            applyInlineFormat('font');
            break;
        case 'directionToggle10':
            generateFlattenedDiv();
            break;


    }
}



function applySiblingDivFormatToNewDiv(){
    var childDivs = editableDivNode.querySelectorAll('div');
    for (var i = 0,iLength = childDivs.length; i < iLength; i++){
        console.log('applyDefaultParagraphFormattingToNewDiv', childDivs[i].style);
        if(!childDivs[i].style.textAlign){
            console.log('no tect align');
            if(i === 0){
                childDivs[i].style.textAlign = editableDivNode.style.textAlign;
            } else {
                childDivs[i].style.textAlign = childDivs[i-1].style.textAlign;
            }
        }
    }

}

function toggleOrientation(){
    console.log('fontUpright',fontUpright);
    if(!fontUpright){
        console.log('fontUpright',fontUpright);
        editableDivNode.style.textOrientation = 'upright';
        fontUpright = true;
    } else {
        editableDivNode.style.textOrientation = 'sideways';
        fontUpright = false;
    }
}

function formatParagraph(alignType){
    console.log('alignParaprah() -- cursorContainer',cursorContainer);
    if(cursorContainer){
        formatAncestorDiv(cursorContainer,'container',alignType);
    } else {
        formatAncestorDiv(nodesForFormatting,'nodesArray',alignType);
    }
}



function formatAncestorDiv(containerOrNodesArray,formatType,alignType){
    switch (formatType){
        case 'container':
            var _ancestorDiv = getAncestorDiv(containerOrNodesArray);
            applyParagraphFormat(_ancestorDiv,alignType);
            break;
        case 'nodesArray':
            applyParagraphFormatsToNodes(containerOrNodesArray,alignType);
            break;
    }
}


function getAncestorDiv(node){
    if (node.nodeName === 'DIV'){
        return node;
    } else {
        return getAncestorDiv(node.parentElement);
    }
}



function applyParagraphFormat(element,formatType){
    switch(formatType){
        case 'rightAlign':
            applyAlignFormat(element,formatType);
            break;
        case 'leftAlign':
            applyAlignFormat(element,formatType);
            break;
        case 'centerAlign':
            applyAlignFormat(element,formatType);
            break;
        case 'doubleSpacing':
            applySpacingFormat(element,formatType);
            break;
    }

}

function applyAlignFormat(element,alignType){
    var textAlignValue = alignType.slice(0,alignType.length-5);
    element.style.textAlign = textAlignValue;
}


function applySpacingFormat(element,spacingType){
    var spacingValue = 2;
    element.style.lineHeight = spacingValue;
}

function applyParagraphFormatsToNodes(nodes,formatType){
    for (var i = 0,iLength = nodes.length; i< iLength; i++ ){
        var _ancestorDiv = getAncestorDiv(nodes[i]);
        switch(formatType){
            case 'rightAlign':
                applyAlignFormat(_ancestorDiv,formatType);
                break;
            case 'leftAlign':
                applyAlignFormat(_ancestorDiv,formatType);
                break;
            case 'centerAlign':
                applyAlignFormat(_ancestorDiv,formatType);
                break;
            case 'doubleSpacing':
                applySpacingFormat(_ancestorDiv,formatType);
                break;
        }
    }
}

function setNodesForFormatting(event) {
    console.log('setNodesForFormatting() -- event', event);
    var selection = window.getSelection();
    if (!selection) {
        return;
    }



    var range = selection.getRangeAt(0);

    if(range.collapsed){
        setCursorContainer(range.startContainer);
        nodesForFormatting = null;
    } else {
        setCursorContainer(null);
    }

    console.log('setNodesForFormatting() -- range', range);
    var nodes = getNodesFromRange(range);
    nodesForFormatting = nodes;
    console.log('setNodesForFormatting() -- nodes', nodes);
    //setInlineFormatting(nodes);
    //initSelectionReplacementListener(nodes);
    //showFormatToolbar(selection.original, blockID);
}

function setCursorContainer(container){
    cursorContainer = container;
}

function getNodesFromRange(range) {
    console.log('getNodesFromRange()', range);
    var parentContainer = range.commonAncestorContainer;
    var startContainer = range.startContainer;
    var endContainer = range.endContainer;
    var startOffset = range.startOffset;
    var endOffset = range.endOffset;

    /* If start and end position are the same -- do not need to process highlight */
    if (startContainer == endContainer && startOffset == endOffset) {
        return false;
    }

    var parentNode = getParentNodeFor(parentContainer);
    var startNode = getParentNodeFor(startContainer);
    var endNode = getParentNodeFor(endContainer);
    var precedingTextNodesInStartContainer = getTextNodesFromContainer(parentNode, startNode.firstChild, startContainer);
    var precedingTextNodesInEndContainer = getTextNodesFromContainer(parentNode, endNode.firstChild, endContainer);


    // correct startOffset against startNode instead of just startContainer
    if (precedingTextNodesInStartContainer.length) {
        for (var i = 0; i < precedingTextNodesInStartContainer.length; i++) {
            var characterLength = precedingTextNodesInStartContainer[i].nodeValue.length;
            startOffset += characterLength;
        }
    }

    // correct endOffset against endNode instead of just endContainer
    if (precedingTextNodesInEndContainer.length) {
        for (var i = 0; i < precedingTextNodesInEndContainer.length; i++) {
            var characterLength = precedingTextNodesInEndContainer[i].nodeValue.length;
            endOffset += characterLength;
        }
    }





    var nodes = getContainedNodes(range);
    console.log('contained nodes', nodes);




    return nodes;
}

function getParentNodeFor(node) {
    while (node.nodeType != 1) {
        node = node.parentNode;
    }
    return node;
}



function getTextNodesFromContainer(rootNode, startNode, endNode) {
    var pastStartNode = false;
    var reachedEndNode = false;
    var textNodes = [];

    function getTextNodesFromNode(node) {
        if (node == startNode) {
            pastStartNode = true;
        }

        if (node == endNode) {
            reachedEndNode = true;

            // when we have found a 'TEXT_NODE' push it to textNodes array
        } else if (node.nodeType == Node.TEXT_NODE) {

            // check that we are not the first node or the last node and that the node is not empty.
            if (pastStartNode && !reachedEndNode && !/^\s*$/.test(node.nodeValue)) {
                textNodes.push(node);
            }

            // loop through each childNode of the current node looking for more childNodes (and so on...)
        } else {
            for (var i = 0, iLength = node.childNodes.length; !reachedEndNode && i < iLength; i++) {
                getTextNodesFromNode(node.childNodes[i]);
            }
        }
    }
    getTextNodesFromNode(rootNode);
    return textNodes;
}


function getContainedNodes(range) {
    var nodes = [];

    // as we use parentContainer, startContainer, endContainer to retrieve the nodes, we need to use the
    // XPath values that we stored in the database to access the nodes
    var parentContainer = range.commonAncestorContainer;
    var startContainer = range.startContainer;
    var endContainer = range.endContainer;
    var startOffset = range.startOffset;
    var endOffset = range.endOffset;

    console.log('startContainer', startContainer);

    if (startContainer == endContainer) {
        console.log('IF [startContainer == endContainer]');

        // check that the startContainer has already been reduced to its textNode
        if (startContainer.nodeType != Node.ELEMENT_NODE) {
            var textNode = startContainer.splitText(startOffset);
            // we have already removed the startContainer so we must also remove the startOffset
            endOffset = endOffset - startOffset;
            // remove the text from the endOffset
            textNode.splitText(endOffset);
            console.log('startContainer.nodeType IS textNode --> push to nodes', textNode);
            nodes.push(textNode);
        }

    } else {
        console.log('condition #01 if(startContainer != endContainer)');
        console.log('condition #01 -- startContainer', startContainer);
        console.log('condition #01 -- startOffset', startOffset);
        console.log('condition #01 -- endcontainer', endContainer);
        console.log('condition #01 -- endOffset', endOffset);
        var startTextNode;
        if (startContainer.nodeType != Node.ELEMENT_NODE) {
            // store back part of startContainer in new var startTextNode
            startTextNode = startContainer.splitText(startOffset);
            console.log('startContainer.nodeType IS textNode --> push to nodes', startTextNode);
            nodes.push(startTextNode);
        }
        var innerNodes = getTextNodesFromContainer(parentContainer, startContainer.nextSibling, endContainer);
        // var innerNodes = getTextNodesFromRange(parentContainer, startContainer.nextSibling, endContainer);
        for (var i = 0; i < innerNodes.length; i++) {
            console.log('innerTextNode --> push to nodes', innerNodes[i]);

            // Do not include innerNodes if it is the startNode
            if (innerNodes[i] == startTextNode) continue;
            nodes.push(innerNodes[i]);
        }

        if (endContainer.nodeType != Node.ELEMENT_NODE) {
            // Keep front part of endContainer
            endContainer.splitText(endOffset);
            console.log('endContainer.nodeType IS textNode --> push to nodes', endContainer);
            nodes.push(endContainer);
        }
    }

    return nodes;
}




function applyInlineFormat(type) {
    console.log('applyFormat()');
    if (type === 'red') {
        wrapNodesWithFormat(type, nodesForFormatting);
    }

    else if (type === 'blue') {
        wrapNodesWithFormat(type, nodesForFormatting);
    }

    else if (type === 'bold') {
        wrapNodesWithFormat(type, nodesForFormatting);
    }

    else if (type === 'underline') {
        console.log('areAllNodesFormatted()',areAllNodesFormatted(type,nodesForFormatting));
        if(areAllNodesFormatted(type,nodesForFormatting)){
            splitNodesAndReformat(nodesForFormatting,type);
        }
        else {
            //splitNodesAndReformat(type,nodeForFormatting);
            wrapNodesWithFormat(type, nodesForFormatting);
        }
    }

    else if (type === 'line-through') {
        wrapNodesWithFormat(type, nodesForFormatting);
    }

    else if (type === 'large-font') {
        wrapNodesWithFormat(type, nodesForFormatting);
    }

    else if (type === 'small-font') {
        wrapNodesWithFormat(type, nodesForFormatting);
    }




    else if (type === 'font'){
        wrapNodesWithFormat(type,nodesForFormatting);
    }

}


function splitNodesAndReformat(nodes,type){
    console.log('splitNodesForFormatting() -- nodes',nodes)
    var matchingAncestorElements = getMatchingAncestorElementsForNodes(nodes,type);

    var matchingAncestorElementTextNodes = getTextNodesFromAncestorElements(matchingAncestorElements);

}

function getTextNodesFromAncestorElements(elements){
    console.log('getTextNodesFromAncestorElements() -- elements',elements);

    var _textNodes = [];
    for (var i = 0,iLength = elements.length; i < iLength; i++){
        _textNodes = _textNodes.concat(getTextNodesFromElement(elements[i]));
    }
    console.log('getTextNodesFromAncestorElements() -- _textNodes',_textNodes);
}

function getMatchingAncestorElementsForNodes(nodes,type){
    var _matchingAncestorElements = [];
    for (var i = 0,iLength = nodes.length; i < iLength; i++){
        matchingAncestorElements = matchingAncestorElements.concat(getMatchingAncestorElementsForNode(nodes[i],type));
    }
    console.log('getMatchingAncestorElements() -- matchingAncestorELements',matchingAncestorElements);
    return _matchingAncestorELementsForNodes;
}

function getMatchingAncestorElementsForNode(node,type, ancestors){
    if(!ancestors || ancestors.length === 0){
        _ancestors = [];
    } else {
        _ancestors = ancestors;
    }
    if (node.parentElement && node.parentElement.id === 'editable-div') {
        return _ancestors;
    } else if (node.parentElement && node.parentElement.className && node.parentElement.className.indexOf(type) >= 0){
        _ancestors.push(node.parentElement);
    }
    console.log('ancestors',_ancestors);

    return getMatchingAncestorElementsForNode(node.parentElement,type,_ancestors);
}


/*function splitNodesAndReformat(type,nodes){
    var parentTypeElements = getParentTypeElements(type,nodes);
    var parentTextNodes = [];
    for (var i = 0,iLength = parentTypeElements.length; i < iLength; i++){
        var innerArray = getTextNodesFromElement(parentTypeElements[i]);
        console.log('splitNodesAndReformat() -- inner parentTextNodes',parentTextNodes);
        console.log('splitNodesAndReformat() -- getTextNodesFromElement(parentTypeElements[i])',getTextNodesFromElement(parentTypeElements[i]));
        console.log('splitNodesAndReformat() -- innerArray',innerArray);
        parentTextNodes = parentTextNodes.concat(innerArray);
    }
    console.log('splitNodesAndReformat() -- parentTextNodes',parentTextNodes);

    var parentTextNodesForReformatting = getParentTextNodesOutsideSelection(parentTextNodes);
    console.log('splitNodesAndReformat() -- parentTextNodesForReformatting',parentTextNodesForReformatting);

    removeFormatFromNodes(type,parentTextNodes);
    //removeSpanFromNodes(type,parentTextNodes);
    // Rewrap the parent noddes that are outside selection
    //wrapNodesWithFormat(type,parentTextNodesForReformatting);

}*/

function getParentTextNodesOutsideSelection(parentTextNodes){
    console.log('nodesForFormatting',nodesForFormatting);
    console.log('parentTextNodes',parentTextNodes);
    var _parentTextNodesOutsideSelection = [];
    for (var i =0,iLength = parentTextNodes.length; i < iLength; i++){
        var found = false;
        for (var j =0,jLength = nodesForFormatting.length; j < jLength; j++){
            console.log('parentTextNodes.nodeValue',parentTextNodes[i].nodeValue);
            console.log('nodesForFormatting.nodeValue',nodesForFormatting[j].nodeValue);
            if( parentTextNodes[i] === nodesForFormatting[j]){
                //if( parentTextNodes[i].nodeValue === nodesForFormatting[j].nodeValue){
                console.log('found');
                found = true;
                continue;
            }
        }
        if( !found ){
            _parentTextNodesOutsideSelection.push(parentTextNodes[i]);
        }
    }
    console.log('getParentTextNodesOutSideSelection()',_parentTextNodesOutsideSelection);
    return _parentTextNodesOutsideSelection;
}

function getParentTypeElements(type,nodes){
    console.log('getParentTypeElements() -- type',type);
    console.log('getParentTypeElements() -- nodes',nodes);
    var _parentTypeElements = [];
    for ( var i =0, iLength = nodes.length; i < iLength; i++){
        console.log('getParentTypeElements() -- node',nodes[i]);
        console.log('getParentTypeElements() -- getAncestorByClass(nodes[i],type)',getAncestorsByClass(type,nodes[i]));
        _parentTypeElements = _parentTypeElements.concat(getAncestorsByClass(type,nodes[i]));
    }
    console.log('getParentTypeElements',_parentTypeElements);
    return _parentTypeElements;
}

/**
 * We need to keep checking until we reach the top as it is possible that we have
 * several layers of spans with the same class applied
 */
function getAncestorsByClass(node, type, ancestors){

    if(!ancestors || ancestors.length === 0){
        _ancestors = [];
    } else {
        _ancestors = ancestors;
    }

    console.log('getAncestorsByClass() -- node',node);
    console.log('getAncestorsByClass() -- type',type);
    console.log('getAncestorsByClass() -- ancestors',ancestors);
    console.log('getAncestorsByClass() -- _ancestors',_ancestors);

    if (node.parentElement && node.parentElement.id === 'editable-div') {
        return _ancestors;
    } else if (node.parentElement && node.parentElement.className && node.parentElement.className.indexOf(type) >= 0){
        _ancestors.push(node.parentElement);
        return getAncestorsByClass(type,node.parentElement,_ancestors);
    }

    return _ancestors;

}

function checkAncestorsByClass(type,node,truthy){
    if(!truthy){
        _truthy = false;
    } else {
        _truthy = truthy;
    }

    if (node.parentElement && node.parentElement.id === 'editable-div') {
        return _truthy;
    } else if (node.parentElement && node.parentElement.className && node.parentElement.className.indexOf(type) >= 0){
        _truthy = true;
        return checkAncestorsByClass(type,node.parentElement,truthy);
    }

    return _truthy;

}

function areAllNodesFormatted(type,nodes){
    for (var i =0,iLength = nodes.length; i < iLength; i++){
        if(!doesNodeHaveAncestorWithType(type,nodes[i])){
            return false;
        }
    }
    return true;
}

function doesNodeHaveAncestorWithType(type, node){
    if(node.parentElement.className && node.parentElement.className.indexOf(type) >= 0){
        return true;
    } else if (node.parentElement && node.parentElement.id === 'editable-div'){
        return false;
    } else {
        return doesNodeHaveAncestorWithType(type,node.parentElement);
    }
}

function removeFormatFromNodes(type,nodes){
    var parentElements = [];
    var parentElementIDs = [];
    for (var i =0, iLength = nodes.length; i < iLength; i++){
        var parentElement = getParentElementWithType(type,nodes[i]);
        if(parentElement && parentElementIDs.indexOf(parentElement.id) < 0){
            parentElements.push(parentElement);
            parentElementIDs.push(parentElement.id);
        }
    }
    console.log('removeFormatFromNodes() -- parentElements',parentElements);
    removeFormatFromNodeParents(type,parentElements);
}

function removeFormatFromNodeParents(type,parentElements){
    for (var i = 0, iLength = parentElements.length; i < iLength; i++){
        parentElements[i].classList.remove(type);
    }
}

function getParentElementWithType(type,node){
    if(node.parentElement.className && node.parentElement.className.indexOf(type) >= 0){
        return node.parentElement;
    } else if (node.parentElement && node.parentElement.id === 'editable-div'){
        return false;
    } else {
        return getParentElementWithType(type,node.parentElement);
    }
}


// experimental
/*function removeSpanFromNodes(type,nodes){
    var spans = [];
    for (var i =0, iLength = nodes.length; i < iLength; i++){
        spans.push(nodes[i].parentElement);
    }
}*/

function removeSpanFromNodes(type,nodes){
    console.log('removeSpanFromNodes() -- type',type);
    console.log('removeSpanFromNodes() -- nodes',nodes);
    var spans = [];
    var spanIDs = [];
    for (var i =0, iLength = nodes.length; i < iLength; i++){
        if(spanIDs.indexOf(nodes[i].parentElement.id) >= 0){
            continue;
        }
        spans.push(nodes[i].parentElement);
        spanIDs.push(nodes[i].parentElement.id);
    }

    console.log('removeSpanFromNodes() -- spans',spans[0].innerHTML);
    /*for (var i = 0; i < elements.length; i++){
       var textNode = document.createTextNode(elements[i].innerText);
       console.log('textNode',textNode);
       var targetParentNode = elements[i].parentNode;
       targetParentNode.insertBefore(textNode,elements[i]);
       targetParentNode.removeChild(elements[i]);

        This is needed to make sure that adjacent #textNodes are joined into a single node
       targetParentNode.normalize();
     }*/
}

function wrapNodesWithFormat(type, nodes) {
    console.log('wrapNodesWIthFormat() -- type', type);
    console.log('wrapNodesWIthFormat() -- nodes', nodes);
    var nodeName = undefined;

    //switch (type) {
    //    case 'bold':
    //        nodeName = 'B';
    //        break;
    //    case 'red':
    //        nodeName = 'SPAN';
    //        break;
    //}

    for (var i = 0; i < nodes.length; i++) {

        // when getting the contained nodes, we are getting the firstNode twice, we need to make sure that we
        // remove it.
        if (i > 0 && nodes[0] == nodes[i]) {
            nodes.splice(i, 1);
            i--;
            continue;
        }

        var newNode = createFormatWrapper(type);
        nodes[i].parentNode.insertBefore(newNode, nodes[i]);
        newNode.appendChild(nodes[i]);
    }





    // sendAllUpdatesToController();
}


function createFormatWrapper(type){

    var wrapperTag = document.createElement('SPAN');
    wrapperTag.id = Date.now();

    if (type === 'bold'){
        wrapperTag.classList.add('bold');
    }

    else if (type === 'red'){
        wrapperTag.classList.add('red');
    }

    else if (type === 'blue'){
        wrapperTag.classList.add('blue');
    }

    else if (type === 'underline'){
        wrapperTag.classList.add('underline');
    }

    else if (type === 'no-underline'){
        wrapperTag.classList.add('no-underline');
    }

    else if (type === 'line-through'){
        wrapperTag.classList.add('line-through');
    }

    else if (type === 'small-font'){
        wrapperTag.classList.add('small-font');
    }

    else if (type === 'large-font'){
        wrapperTag.classList.add('large-font');
    }

    else if (type === 'font'){
        wrapperTag.classList.add('font');
    }


    //span.setAttribute("data-id", noteID);
    console.log('wrapperTag',wrapperTag);
    return wrapperTag;
}


function generateFlattenedDiv(){
    var _textNodes = getTextNodesFromElement(editableDivNode);
    console.log('_textNodes',_textNodes);
    var _flattenReadyItems = getFlattenReadyItems(_textNodes);
    console.log('_flattenReadyItems',_flattenReadyItems);
}

function getFlattenReadyItems(nodes){
    var _flattenReadyItems = [];
    var flattenReadyItem;
    for (var i = 0, iLength = nodes.length; i < iLength; i++){
        flattenReadyItem = {};
        if(nodes[i].nodeValue === '[_RETURN]'){
            flattenReadyItem.text = nodes[i].nodeValue;
            _flattenReadyItems.push(flattenReadyItem);
            continue;
        }

        var computedNodeStyle = window.getComputedStyle(nodes[i].parentElement);
        console.log('computedNodeStyle',computedNodeStyle);
        flattenReadyItem.text = nodes[i].nodeValue;
        flattenReadyItem.length = nodes[i].length;
        flattenReadyItem.color = computedNodeStyle.color;
        flattenReadyItem.fontFamily = computedNodeStyle.fontFamily;
        flattenReadyItem.fontWeight = computedNodeStyle.fontWeight;
        flattenReadyItem.textDecoration = computedNodeStyle.textDecoration;
        flattenReadyItem.fontVariant = computedNodeStyle.fontVariant;
        _flattenReadyItems.push(flattenReadyItem);

    }
    return _flattenReadyItems;
}

function getTextNodesFromElement(node,nodes){

    if(!nodes || nodes.length === 0){
        _nodes = [];
    }

    console.log('getTextNodesFromElement() -- node',node);

    if (node.nodeType == Node.TEXT_NODE) {

        // check that we are not the first node or the last node and that the node is not empty.
        //if (!/^\s*$/.test(node.nodeValue)) {
        //    _nodes.push(node);
        //}

        // loop through each childNode of the current node looking for more childNodes (and so on...)
    } else if(node.nodeType === 1 && node.nodeName === 'DIVBR'){
        var newTextNode = document.createTextNode('[_RETURN]');
        _nodes.push(newTextNode);
    } else {
        console.log('getTextNodesFromElement() -- node',node);
        if(node.nodeName === 'DIV' && node.id !== 'editable-div'){
            var newTextNode = document.createTextNode('[_RETURN]');
            _nodes.push(newTextNode);
        }
        for (var i = 0, iLength = node.childNodes.length; i < iLength; i++) {
            //if()
            return getTextNodesFromElement(node.childNodes[i],_nodes);
        }
    }
    return _nodes;
}
