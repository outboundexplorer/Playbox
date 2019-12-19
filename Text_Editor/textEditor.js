(function(){

    'use strict';

    function textGUI$(pElementID) {
        var _this = this;

        var textProps = {
            editableDivNode: null,
            isSelecting: false,
            nodesForFormatting: null,
            cursorContainer: null,
            fontUpright: false
        };

        var tab = '&#9;';

        var bassData = '1111\n' +
            '\n' +
            '670753665268421 300000000000000 0 0 2 2 2 2 1 0\n' +
            '<fi0*0400*ARIALUNICODEMS' + tab + 'ArialUnicodeMS' + tab + 'Arial Unicode MS' + tab + 'Arial Unicode MS' + tab + 'Arial Unicode MS><fn0*0400*ARIALUNICODEMS><bc00>5 <bc0255>8 <bc00>1 <bc167116800>3 <bc00>1 <u>6 <u>6 <..>this was the most simple thing';

        /**
         * Define the CSS classes used to manage the applied styles
         * -- Note that the special 'removal' classes such as for "noUnderline" cannot be an extended version of the
         *    'addition' classes as this will cause a conflict on indexOf() search as both underLine and noUnderline
         *    will both match.
         * @type {{red: string, noUnderline: string, blue: string, underline: string}}
         */
        var CLASSES = {
            underline: 'tgui-y-underline',
            noUnderline: 'tgui-n-underline',
            red: 'tgui-red',
            blue: 'tgui-blue',
            black: 'tgui-black'
        };

        var renderEngine = '1111\n\n';
        var boxFormat = '670753665268421 300000000000000 0 0 2 2 2 2 1 0\n';

        var FONTS = {
            arial: {
                fontid: '0*0400*ARIALUNICODEMS',
                include: '0*0400*ARIALUNICODEMS\tArialUnicodeMS\tArial Unicode MS\tArial Unicode MS\tArial Unicode MS'
            }
        };

        /**
         * API public methods
         * @type {applyColor}
         */
        _this.applyColor = applyColor;
        _this.applyDecoration = applyDecoration;
        _this.generateFlattenedDiv = generateFlattenedDiv;
        _this.populateHTML = populateHTML;

        initGUI();

        function initGUI() {
            defineBox();
            makeBoxContentEditable();
            registerListeners();
        }

        /***** Public Methods *****/

        /**
         * Apply colour by using color classname
         * @param color
         */
        function applyColor(color) {
            wrapNodesWithFormat(textProps.nodesForFormatting, color);
        }

        function applyDecoration(style) {
            switch (style) {
                case 'underline':
                    console.log('areAllNodesFormatted()', areAllNodesFormatted(textProps.nodesForFormatting, style));
                    if (areAllNodesFormatted(textProps.nodesForFormatting, style)) {
                        splitNodesAndReformat(textProps.nodesForFormatting, style);
                    } else {
                        //splitNodesAndReformat(style,nodeForFormatting);
                        wrapNodesWithFormat(textProps.nodesForFormatting, style);
                    }
                    break;

                case 'line-through':
                    wrapNodesWithFormat(textProps.nodesForFormatting, style);
            }
        }

        function applyInlineFormat(style) {
            console.log('applyFormat()');


            if (style === 'bold') {
                wrapNodesWithFormat(style, textProps.nodesForFormatting);
            } else if (style === 'large-font') {
                wrapNodesWithFormat(style, textProps.nodesForFormatting);
            } else if (style === 'small-font') {
                wrapNodesWithFormat(style, textProps.nodesForFormatting);
            } else if (style === 'font') {
                wrapNodesWithFormat(style, textProps.nodesForFormatting);
            }

        }


        /***** Private functions *****/
        function defineBox() {
            console.log(document.querySelector('#' + pElementID));
            textProps.editableDivNode = document.querySelector('#' + pElementID);
        }

        function makeBoxContentEditable(){
            textProps.editableDivNode.setAttribute('contenteditable',true);
        }

        function registerListeners() {
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
            if (textProps.isSelecting) {
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
            if (event.keyCode === 13) {
                console.log('handle return -- event', event);
                applySiblingDivFormatToNewDiv();
            }
            setNodesForFormatting(event);
        }

        function setNodesForFormatting(event) {
            console.log('setNodesForFormatting() -- event', event);
            var selection = window.getSelection();

            if (!selection) {
                return;
            }

            var range = selection.getRangeAt(0);

            if (range.collapsed) {
                setCursorContainer(range.startContainer);
                nodesForFormatting = null;
            } else {
                setCursorContainer(null);
            }

            console.log('setNodesForFormatting() -- range', range);
            var nodes = getNodesFromRange(range);
            textProps.nodesForFormatting = nodes;
            console.log('setNodesForFormatting() -- nodes', nodes);
            //setInlineFormatting(nodes);
            //initSelectionReplacementListener(nodes);
            //showFormatToolbar(selection.original, blockID);
        }

        function setCursorContainer(container) {
            textProps.cursorContainer = container;
        }

        function getNodesFromRange(range) {
            console.log('getNodesFromRange()', range);
            var parentContainer = range.commonAncestorContainer;
            var startContainer = range.startContainer;
            var endContainer = range.endContainer;
            var startOffset = range.startOffset;
            var endOffset = range.endOffset;

            /* If start and end position are the same -- do not proceed */
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


        function applySiblingDivFormatToNewDiv() {
            var childDivs = editableDivNode.querySelectorAll('div');
            for (var i = 0, iLength = childDivs.length; i < iLength; i++) {
                console.log('applyDefaultParagraphFormattingToNewDiv', childDivs[i].style);
                if (!childDivs[i].style.textAlign) {
                    console.log('no tect align');
                    if (i === 0) {
                        childDivs[i].style.textAlign = editableDivNode.style.textAlign;
                    } else {
                        childDivs[i].style.textAlign = childDivs[i - 1].style.textAlign;
                    }
                }
            }

        }

        function toggleOrientation() {
            console.log('fontUpright', fontUpright);
            if (!fontUpright) {
                console.log('fontUpright', fontUpright);
                editableDivNode.style.textOrientation = 'upright';
                fontUpright = true;
            } else {
                editableDivNode.style.textOrientation = 'sideways';
                fontUpright = false;
            }
        }

        function formatParagraph(alignType) {
            console.log('alignParaprah() -- cursorContainer', cursorContainer);
            if (cursorContainer) {
                formatAncestorDiv(cursorContainer, 'container', alignType);
            } else {
                formatAncestorDiv(nodesForFormatting, 'nodesArray', alignType);
            }
        }


        function formatAncestorDiv(containerOrNodesArray, styleType, alignType) {
            switch (styleType) {
                case 'container':
                    var _ancestorDiv = getAncestorDiv(containerOrNodesArray);
                    applyParagraphFormat(_ancestorDiv, alignType);
                    break;
                case 'nodesArray':
                    applyParagraphFormatsToNodes(containerOrNodesArray, alignType);
                    break;
            }
        }


        function getAncestorDiv(node) {
            if (node.nodeName === 'DIV') {
                return node;
            } else {
                return getAncestorDiv(node.parentElement);
            }
        }


        function applyParagraphFormat(element, styleType) {
            switch (styleType) {
                case 'rightAlign':
                    applyAlignFormat(element, styleType);
                    break;
                case 'leftAlign':
                    applyAlignFormat(element, styleType);
                    break;
                case 'centerAlign':
                    applyAlignFormat(element, styleType);
                    break;
                case 'doubleSpacing':
                    applySpacingFormat(element, styleType);
                    break;
            }

        }

        function applyAlignFormat(element, alignType) {
            var textAlignValue = alignType.slice(0, alignType.length - 5);
            element.style.textAlign = textAlignValue;
        }


        function applySpacingFormat(element, spacingType) {
            var spacingValue = 2;
            element.style.lineHeight = spacingValue;
        }

        function applyParagraphFormatsToNodes(nodes, styleType) {
            for (var i = 0, iLength = nodes.length; i < iLength; i++) {
                var _ancestorDiv = getAncestorDiv(nodes[i]);
                switch (styleType) {
                    case 'rightAlign':
                        applyAlignFormat(_ancestorDiv, styleType);
                        break;
                    case 'leftAlign':
                        applyAlignFormat(_ancestorDiv, styleType);
                        break;
                    case 'centerAlign':
                        applyAlignFormat(_ancestorDiv, styleType);
                        break;
                    case 'doubleSpacing':
                        applySpacingFormat(_ancestorDiv, styleType);
                        break;
                }
            }
        }


        function splitNodesAndReformat(nodes, style) {
            console.log('splitNodesForFormatting() -- nodes', nodes)
            console.log('splitNodesForFormatting() -- formactClass', style)
            var matchingAncestorElements = getMatchingAncestorElementsForNodes(nodes, style);

            console.log('matchingAncestorElements',matchingAncestorElements);

            var matchingAncestorElementTextNodes = getTextNodesFromAncestorElements(matchingAncestorElements);
            console.log('matchingAncesotry',matchingAncestorElementTextNodes);

            var nodesForReformatting = getNodesForReformatting(matchingAncestorElementTextNodes);
            console.log('nodesForReformatting',nodesForReformatting);

            removeFormatFromElements(matchingAncestorElements,style);

            switch (style)
            {
                case 'underline':
                    wrapNodesWithFormat(textProps.nodesForFormatting, 'none');
                    wrapNodesWithFormat(nodesForReformatting, style);
            }


        }

        function getNodesForReformatting(ancestorNodes){
            var _nodesForReformatting = [];

            for (var i = 0, iLength = ancestorNodes.length; i < iLength; i++)
            {
                var found = false;
                for (var j = 0, jLength = textProps.nodesForFormatting.length; j < jLength; j++)
                {
                    if (ancestorNodes[i].isSameNode(textProps.nodesForFormatting[j]))
                    {
                        found = true;
                    }
                }
                if (found === false)
                {
                    _nodesForReformatting.push(ancestorNodes[i]);
                }
            }
            return _nodesForReformatting;
        }

        function getTextNodesFromAncestorElements(elements) {
            console.log('getTextNodesFromAncestorElements() -- elements', elements);

            var _textNodes = [];
            for (var i = 0, iLength = elements.length; i < iLength; i++) {
                console.log('getTextNodesFromAncestorElements -- nodes',getTextNodesFromElement(elements[i]));
                _textNodes = _textNodes.concat(getTextNodesFromElement(elements[i]));
            }
            var _textNodes = Tool$.getUniqueArray(_textNodes);
            console.log('getTextNodesFromAncestorElements() -- _textNodes', _textNodes);

            return _textNodes;
        }

        function getMatchingAncestorElementsForNodes(nodes, style) {
            var matchingAncestorElements = [];
            for (var i = 0, iLength = nodes.length; i < iLength; i++) {
                matchingAncestorElements = matchingAncestorElements.concat(getMatchingAncestorElementsForNode(nodes[i], style));
            }
            console.log('getMatchingAncestorElements() -- matchingAncestorELements', matchingAncestorElements);
            return matchingAncestorElements;
        }

        function getMatchingAncestorElementsForNode(node, style, ancestors) {

            if (!ancestors || ancestors.length === 0) {
                ancestors = [];
            }
            if (node.parentElement && node.parentElement.id === pElementID) {
                return ancestors;
            } else if (node.parentElement && node.parentElement.className && node.parentElement.className.indexOf(style) >= 0) {
                ancestors.push(node.parentElement);
            }
            console.log('ancestors', ancestors);

            return getMatchingAncestorElementsForNode(node.parentElement, style, ancestors);
        }



        function getParentTextNodesOutsideSelection(parentTextNodes) {
            console.log('nodesForFormatting', nodesForFormatting);
            console.log('parentTextNodes', parentTextNodes);
            var _parentTextNodesOutsideSelection = [];
            for (var i = 0, iLength = parentTextNodes.length; i < iLength; i++) {
                var found = false;
                for (var j = 0, jLength = nodesForFormatting.length; j < jLength; j++) {
                    console.log('parentTextNodes.nodeValue', parentTextNodes[i].nodeValue);
                    console.log('nodesForFormatting.nodeValue', nodesForFormatting[j].nodeValue);
                    if (parentTextNodes[i] === nodesForFormatting[j]) {
                        //if( parentTextNodes[i].nodeValue === nodesForFormatting[j].nodeValue){
                        console.log('found');
                        found = true;
                        continue;
                    }
                }
                if (!found) {
                    _parentTextNodesOutsideSelection.push(parentTextNodes[i]);
                }
            }
            console.log('getParentTextNodesOutSideSelection()', _parentTextNodesOutsideSelection);
            return _parentTextNodesOutsideSelection;
        }

        function getParentTypeElements(style, nodes) {
            console.log('getParentTypeElements() -- style', style);
            console.log('getParentTypeElements() -- nodes', nodes);
            var _parentTypeElements = [];
            for (var i = 0, iLength = nodes.length; i < iLength; i++) {
                console.log('getParentTypeElements() -- node', nodes[i]);
                console.log('getParentTypeElements() -- getAncestorByClass(nodes[i],style)', getAncestorsByClass(style, nodes[i]));
                _parentTypeElements = _parentTypeElements.concat(getAncestorsByClass(style, nodes[i]));
            }
            console.log('getParentTypeElements', _parentTypeElements);
            return _parentTypeElements;
        }

        /**
         * We need to keep checking until we reach the top as it is possible that we have
         * several layers of spans with the same class applied
         */
        function getAncestorsByClass(node, style, ancestors) {

            if (!ancestors || ancestors.length === 0) {
                _ancestors = [];
            } else {
                _ancestors = ancestors;
            }

            console.log('getAncestorsByClass() -- node', node);
            console.log('getAncestorsByClass() -- style', style);
            console.log('getAncestorsByClass() -- ancestors', ancestors);
            console.log('getAncestorsByClass() -- _ancestors', _ancestors);

            if (node.parentElement && node.parentElement.id === pElementID) {
                return _ancestors;
            } else if (node.parentElement && node.parentElement.className && node.parentElement.className.indexOf(style) >= 0) {
                _ancestors.push(node.parentElement);
                return getAncestorsByClass(style, node.parentElement, _ancestors);
            }

            return _ancestors;

        }


        function areAllNodesFormatted(nodes, style) {
            for (var i = 0, iLength = nodes.length; i < iLength; i++) {
                if (!doesNodeHaveAncestorWithFormat(nodes[i], style)) {
                    return false;
                }
            }
            return true;
        }

        function doesNodeHaveAncestorWithFormat(node, style) {

            if (node.parentElement && node.parentElement.id === pElementID)
            {
                return false;
            }
            else if (node.parentElement.className && node.parentElement.className.indexOf(CLASSES[style]) >= 0)
            {
                return true;
            }
            else
            {
                return doesNodeHaveAncestorWithFormat(node.parentElement, style);
            }
        }


        function removeFormatFromElements(parentElements, style) {
            for (var i = 0, iLength = parentElements.length; i < iLength; i++) {
                parentElements[i].classList.remove(CLASSES[style]);
            }
        }

        function getTextNodesFromElement(node, isFlattening) {

            var _nodes = [];

            _getRecursiveTextNodes(node,isFlattening);

            return _nodes;

            function _getRecursiveTextNodes(node, isFlattening){
                console.log('getRecursiveTextNodes() -- node START', node);

                if (node.nodeType == Node.TEXT_NODE) {
                    // check that we are not the first node or the last node and that the node is not empty.
                    //if (!/^\s*$/.test(node.nodeValue)) {
                    _nodes.push(node);
                    console.log('getRecursiveTextNodes() -- node 1', node);
                    //}

                    // loop through each childNode of the current node looking for more childNodes (and so on...)
                } else if (node.nodeType === 1 && isFlattening && node.nodeName === 'DIVBR') {
                    var newTextNode = document.createTextNode('[_RETURN]');
                    _nodes.push(newTextNode);
                } else {
                    console.log('getRecursiveTextNodes() -- node 2', node);
                    if (node.nodeName === 'DIV' && isFlattening && node.id !== pElementID) {
                        var newTextNode = document.createTextNode('[_RETURN]');
                        _nodes.push(newTextNode);
                    }

                    for (var i = 0, iLength = node.childNodes.length; i < iLength; i++) {
                        //if()
                        _getRecursiveTextNodes(node.childNodes[i], isFlattening);
                    }
                }
            }


        }



        function wrapNodesWithFormat(nodes, style) {
            console.log('wrapNodesWIthFormat() -- style', style);
            console.log('wrapNodesWIthFormat() -- nodes', nodes);
            var nodeName = undefined;

            for (var i = 0; i < nodes.length; i++) {

                // when getting the contained nodes, we are getting the firstNode twice, we need to make sure that we
                // remove it.
                if (i > 0 && nodes[0] == nodes[i]) {
                    nodes.splice(i, 1);
                    i--;
                    continue;
                }

                var newNode = createFormatWrapper(style);
                // forceNormalize();
                nodes[i].parentNode.insertBefore(newNode, nodes[i]);
                newNode.appendChild(nodes[i]);

            }
        }

        function forceNormalize(){
            document.querySelector('#'+pElementID).normalize();
        }

        /**
         * Apply styles to the wrapper element -- note that classes are used as when styles are applied directly, it
         * becomes more challenging to check on ancestor properties (ancestor properties are needed as in some instances
         * modifying the child element does not remove the styling from the child element -- such as text-decoration;
         * CSS classes provide a faster technique for class checking and remove a heavy reliance on using
         * getComputedStyle.
         * @param style
         * @returns {HTMLElement}
         */
        function createFormatWrapper(style) {

            var wrapperTag = document.createElement('SPAN');

            if (style === 'none')
            {
            }
            else if (style === 'bold')
            {
                wrapperTag.classList.add('bold');
            }
            else if (style === 'red')
            {
                wrapperTag.classList.add(CLASSES[style]);
            }
            else if (style === 'blue')
            {
                wrapperTag.classList.add(CLASSES[style]);
            }
            else if (style === 'underline')
            {
                wrapperTag.classList.add(CLASSES[style]);
            }
            else if (style === 'noUnderline')
            {
                wrapperTag.classList.add(CLASSES[style]);
            }
            else if (style === 'line-through')
            {
                wrapperTag.classList.add('line-through');
            }
            else if (style === 'small-font')
            {
                wrapperTag.classList.add('small-font');
            }
            else if (style === 'large-font')
            {
                wrapperTag.classList.add('large-font');
            }
            else if (style === 'font') {
                wrapperTag.classList.add('font');
            }


            //span.setAttribute("data-id", noteID);
            console.log('wrapperTag', wrapperTag);
            return wrapperTag;
        }


        function generateFlattenedDiv() {
            forceNormalize();
            var _textNodes = getTextNodesFromElement(textProps.editableDivNode);
            console.log('_textNodes', _textNodes);
            var _flattenReadyItems = getFlattenReadyItems(_textNodes);

            console.log('_flattenReadyItems', _flattenReadyItems);
            buildTextProcText(_flattenReadyItems);
        }

        function getFlattenReadyItems(nodes) {
            var _flattenReadyItems = [];
            var flattenReadyItem;
            for (var i = 0, iLength = nodes.length; i < iLength; i++) {
                flattenReadyItem = {};
                if (nodes[i].nodeValue === '[_RETURN]') {
                    flattenReadyItem.text = nodes[i].nodeValue;
                    _flattenReadyItems.push(flattenReadyItem);
                    continue;
                }

                var computedNodeStyle = window.getComputedStyle(nodes[i].parentElement);
                console.log('computedNodeStyle', computedNodeStyle);
                flattenReadyItem.text = nodes[i].nodeValue;
                flattenReadyItem.length = nodes[i].length;
                flattenReadyItem.color = computedNodeStyle.color;
                flattenReadyItem.fontFamily = computedNodeStyle.fontFamily;
                flattenReadyItem.fontWeight = computedNodeStyle.fontWeight;
                flattenReadyItem.textDecorationLine = computedNodeStyle.textDecorationLine;
                flattenReadyItem.fontVariant = computedNodeStyle.fontVariant;
                _flattenReadyItems.push(flattenReadyItem);

            }
            return _flattenReadyItems;
        }

        /**
         *
         * <tc> Text fill color
         * <u> Text underline
         * <..> End of all style data
         */
        function buildTextProcText(pFlattenedReadyItems){
            var textString = '';
            var styleRun = '';
            var lastColor = null;
            var lastDecoration = 'none';
            var styleRunLength = 0;

            for (var i = 0, iLength = pFlattenedReadyItems.length; i < iLength; i++){
                _buildTextString(pFlattenedReadyItems[i].text);
                _buildStyleRun(pFlattenedReadyItems[i], i, iLength);

            }

            function _buildTextString(textItem)
            {
                textString += textItem;
            }

            function _buildStyleRun(pFlattenedItem, pIndex, pILength)
            {
                var hasRunChange = false;
                var thisStyleRun = '';
                if (pFlattenedItem.color !== lastColor)
                {
                    hasRunChange = true;
                    thisStyleRun += '<tc' + Tool$.RGB2Int(pFlattenedReadyItems[pIndex].color) + '>';
                    lastColor = pFlattenedItem.color;
                    console.log('thisStyleRun',thisStyleRun);
                }

                if (pFlattenedItem.textDecorationLine !== lastDecoration)
                {
                    hasRunChange = true;
                    thisStyleRun += '<u>';
                    lastDecoration = pFlattenedItem.textDecorationLine;
                    console.log('thisStyleRun',thisStyleRun);
                }


                if(pIndex === 0)
                {
                    styleRun += thisStyleRun;
                    styleRunLength += pFlattenedItem.text.length;
                }
                else if (hasRunChange)
                {
                    styleRun += styleRunLength + ' ' + thisStyleRun;
                    if (pIndex === pILength -1)
                    {
                        styleRun += pFlattenedItem.text.length + ' <..>';
                    }
                    styleRunLength = pFlattenedItem.text.length;
                }
                else
                {
                    styleRunLength += pFlattenedItem.text.length;
                }
            }

            // console.log('textString',textString);
            // console.log('styleRun',styleRun);
            // console.log('textProcText',styleRun + textString);
            var textProcFinal = renderEngine + boxFormat + '<fi' + FONTS.arial.include + '>' + '<fn' + FONTS.arial.fontid + '>' + styleRun + textString + '\n<EOT>';
            console.log(textProcFinal);
        }

        //<t>This</t>
        //<span><t>is</t></span>
        //<t>Good</t>

        /**
         * '1111\n' +
         '\n' +
         '670753665268421 300000000000000 0 0 2 2 2 2 1 0\n' +
         '<fi0*0400*ARIALUNICODEMS\tArialUnicodeMS\tArial Unicode MS\tArial Unicode MS\tArial Unicode MS><fn0*0400*ARIALUNICODEMS><bc0>5 <bc255>8 <bc0>1 <bc167116800>3 <bc00>1 <u>6 <u>6 <..>this was the most simple thing';

         * @param pBassData
         */
        function populateHTML(pBassData){
            bassData = pBassData || bassData;
            var styleRunData = '<tc0>5 <tc255>8 <tc0>1 <tc16711680>3 <tc0>1 <u>6 <u>6 <..>this was the most simple thing';
            var textIndex = styleRunData.indexOf('<..>');
            var text = styleRunData.slice(textIndex + 4);
            var styleRun = styleRunData.slice(0,textIndex-1);
            console.log('text', text);
            console.log('styleRun', styleRun);
            var soloStyleElements = styleRun.split(' ');
            console.log('styleElements',styleElements);
            var lastStyles = {
              color: 0,
              underline: false
            };

            var styleElements = [];

            for (var i = 0, iLength = soloStyleElements.length; i < iLength; i++)
            {
                var styleElement, color, underline;

                var styleString = soloStyleElements[i].split('>');
                console.log('styleElement',styleString);
                if (styleString[0].slice(1,3) === 'tc')
                {
                    color = styleString[0].slice(3);
                    underline = lastStyles.underline;
                    lastStyles.color = color;
                }
                else if (styleString[0].slice(1,2) === 'u')
                {
                    color =  lastStyles.color;
                    underline = !lastStyles.underline;
                    lastStyles.underline = underline;
                }

                styleElement = {
                    color: parseInt(color),
                    underline: underline,
                    length: parseInt(styleString[1])
                };

                styleElements.push(styleElement);






            }

            console.log('styleElements',styleElements);

            var fragment = new DocumentFragment();

            var countLength = 0;

            for (var i = 0, iLength = styleElements.length; i < iLength; i++)
            {
                var span = document.createElement('SPAN');
                span.innerText = text.slice(countLength,countLength + styleElements[i].length);
                console.log('text',text);
                countLength += styleElements[i].length;
                span.classList.add(getColorClassFromInt(styleElements[i].color));
                // span.classLis/t.add(getUnderlineClassFromInt(styleElements[i].underline));
                fragment.append(span);
            }

            console.log(fragment,fragment);

            while (textProps.editableDivNode.firstChild)
            {
                textProps.editableDivNode.removeChild(textProps.editableDivNode.firstChild);
            }
            textProps.editableDivNode.append(fragment);



        }

        // functi

        function getColorClassFromInt(colorInt)
        {
            var colorClass;
            if (colorInt === 0)
            {
                colorClass = CLASSES.black;
            }
            else if (colorInt === 255)
            {
                colorClass = CLASSES.blue;
            }
            else if(colorInt === 16711680)
            {
                colorClass = CLASSES.red;
            }
            return colorClass;
        }






    }

    window.textGUI$ = textGUI$;
})();
