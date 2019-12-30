(function(){

    'use strict';

    function textGUI$(pElementID) {
        var _this = this;

        var textProps = {
            editableDivNode: null,
            boxWidth: 0,
            boxHeight: 0,
            isSelecting: false,
            nodesForFormatting: null,
            cursorContainer: null,
            fontUpright: false,
            styleRun: null
        };

        var TAB = String.fromCharCode(9);
        var RETURN = String.fromCharCode(13);


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
            black: 'tgui-black',
            zapfino: 'tgui-zapfino',
            atypewriter: 'tgui-atypewriter'
        };


        // include = fontid + postscript + family + display + full
        var FONTS = {
            arial: {
                fontid: '0*0400*ARIALUNICODEMS',
                include: '0*0400*ARIALUNICODEMS' + TAB + 'ArialUnicodeMS' + TAB + 'Arial Unicode MS' + TAB + 'Arial Unicode MS' + TAB + 'Arial Unicode MS'
            },
            zapfino: {
                fontid: '0*0400*ZAPFINO',
                include: '0*0400*ZAPFINO' + TAB + 'Zapfino' + TAB + 'Zapfino' + TAB + 'Zapfino' + TAB + 'Zapfino'
            },
            atypewriter: {
                fontid: '0*0400*AMERICANTYPEWRITER',
                include: '0*0400*AMERICANTYPEWRITER' + TAB + 'AmericanTypewriter' + 'American Typewriter' + TAB + 'American Typewriter' + TAB + 'American Typewriter'
            }
        };

        /**
         * Note that for font values we are replacing spaces with underscore
         * @type {{color: {prop: string}, underline: {prop: string, value: string}, zapfino: {fontid: string, prop: string, factor: number, value: string}, atypewriter: {fontid: string, prop: string, value: string}}}
         */
        var STYLES = {
           underline: {
               prop: 'text-decoration',
               value: 'underline'
           },
           zapfino: {
               prop: 'font-family',
               value: 'Zapfino',
               fontid: '0*0400*ZAPFINO',
               factor: 2
           },
           atypewriter: {
               prop: 'font-family',
               value: 'American_Typewriter',
               fontid: '0*0400*AMERICANTYPEWRITER'
           },
            color: {
               prop: 'color'
            }
        };

        var renderEngine = '1111' + RETURN + RETURN;
        var boxFormat = '512473473139117 220048548281196 0 1 2 2 2 2' + RETURN;
        var renderHeader = '0111' + RETURN + RETURN + '900000000000000 600000000000000 0 0 0 0 0 0 1 0' + RETURN;
        // var renderHeader = '0111' + RETURN + RETURN + '900000000000000 600000000000000 0 0 0 0 0 0 1 0' + RETURN;
        // var renderHeader = '0111' + RETURN + RETURN + '300000000000000 300000000000000 0 0 0 0 0 0 1 0' + RETURN;
        // var renderHeader = '0111' + RETURN + RETURN + '300000000000000 300000000000000 0 0 0 0 0 0 1 0' + RETURN+ '<fi' + FONTS.arial.include + '>' + '<fn' + FONTS.arial.fontid + '><ts3200>';
        var renderEnd = RETURN + '<EOT>' + TAB + RETURN;



        // <fi0*0400*HYDROGENWHISKEY	HydrogenWhiskey	HydrogenWhiskey	HydrogenWhiskey	HydrogenWhiskey><fn0*0400*HYDROGENWHISKEY>

        /**
         * API public methods
         * @type {applyColor}
         */
        _this.applyColor = applyColor;
        _this.applyDecoration = applyDecoration;
        _this.applyFont = applyFont;
        _this.generateFlattenedDiv = generateFlattenedDiv;
        _this.clearEditor = clearEditor;
        _this.populateHTML = populateHTML;
        _this.appendStyleRunData = appendStyleRunData;
        _this.showDemo = showDemo;
        _this.handleDownloadFileButton = handleDownloadFileButton;

        initGUI();

        function initGUI() {
            defineBox();
            calculateBoxDimensions();
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

        function applyFont(fontName){
            wrapNodesWithFormat(textProps.nodesForFormatting, fontName);
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

        function calculateBoxDimensions(){
            window.setTimeout(function(){
                textProps.boxWidth = textProps.editableDivNode.clientWidth;
                textProps.boxHeight = textProps.editableDivNode.clientHeight;
                console.log(textProps);
                renderHeader = '0111' + RETURN + RETURN + (TaopixBigNumber.scaleNumberUp(textProps.boxWidth/72)) + ' ' + (TaopixBigNumber.scaleNumberUp(textProps.boxHeight/72)) + ' ' + '0 0 0 0 0 0 1 0' + RETURN;
                console.log('renderHeader', renderHeader);
            },1000);
        }

        // 600 * 100000000000000 / 72

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
            console.log('splitNodesForFormatting() -- nodes', nodes);
            console.log('splitNodesForFormatting() -- formactClass', style);
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

            var inlineStyle = getInlineStyleObject(style);
            if (node.parentElement && node.parentElement.id === pElementID) {
                return ancestors;
            } else if (node.parentElement && node.parentElement.style[inlineStyle.prop] === inlineStyle.value) {
                ancestors.push(node.parentElement);
            }
            console.log('ancestors', ancestors);

            return getMatchingAncestorElementsForNode(node.parentElement, style, ancestors);
        }







        function areAllNodesFormatted(nodes, style) {
            for (var i = 0, iLength = nodes.length; i < iLength; i++) {
                if (!doesNodeHaveAncestorWithFormat(nodes[i], style)) {
                    return false;
                }
            }
            return true;
        }

        function getInlineStyleObject(style){
            var inlineStyle = {};

            switch (style){
                case 'underline':
                    inlineStyle = {
                        prop: 'textDecoration',
                        value: 'underline'
                    };
                    break;
            }

            return inlineStyle;
        }

        function doesNodeHaveAncestorWithFormat(node, style) {
            console.log('doesNodeHaveAncestorWithFormat() -- node',node);
            console.log('doesNodeHaveAncestorWithFormat() -- style',style);
            console.log('doesNodeHaveAncestorWithFormat() -- node.parentElement',node.parentElement);
            console.log('doesNodeHaveAncestorWithFormat() -- node.parentElement.style',node.parentElement.style);
            var inlineStyle = getInlineStyleObject(style);

            if (node.parentElement && node.parentElement.id === pElementID)
            {
                return false;
            }
            else if (node.parentElement.style[inlineStyle.prop] === inlineStyle.value)
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
                parentElements[i].style.removeProperty(STYLES[style].prop);
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

                var newNode = createFormatWrapper(nodes[i],style);
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
        function createFormatWrapper(node,style) {

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
                wrapperTag = applyComplementStyles(wrapperTag,node,style);
                wrapperTag.style.color = 'red';
            }
            else if (style === 'blue')
            {
                wrapperTag = applyComplementStyles(wrapperTag,node,style);
                wrapperTag.style.color = 'blue';
            }
            else if (style === 'underline')
            {
                wrapperTag.style.textDecoration = 'underline';
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
            else if (style === 'zapfino') {
                wrapperTag = applyComplementStyles(wrapperTag,node,style);
                wrapperTag.style.fontFamily = STYLES.zapfino.value;
            }
            else if (style === 'atypewriter') {
                wrapperTag.style.fontFamily = STYLES.atypewriter.value;

            }


            //span.setAttribute("data-id", noteID);
            console.log('wrapperTag', wrapperTag);
            return wrapperTag;
        }

        function applyComplementStyles(wrapperTag, node, style){
            switch (style){
                case 'red':
                    var parentTextDecoration = window.getComputedStyle(node.parentElement).textDecoration;
                    if (parentTextDecoration && parentTextDecoration.indexOf('underline') >= 0)
                    {
                        wrapperTag.style.setProperty('text-decoration','underline red');
                    }
                    break;
                case 'blue':
                    var parentTextDecoration = window.getComputedStyle(node.parentElement).textDecoration;
                    if (parentTextDecoration && parentTextDecoration.indexOf('underline') >= 0)
                    {
                        wrapperTag.style.setProperty('text-decoration','underline blue');
                    }
                    break;
                case 'zapfino':
                    var parentFontSize = parseInt(window.getComputedStyle(node.parentElement).fontSize);
                    wrapperTag.style.setProperty('font-size',(parentFontSize * STYLES.zapfino.factor) + 'px');
                    break;

            }

            return wrapperTag;
        }


        function generateFlattenedDiv() {
            forceNormalize();
            var _textNodes = getTextNodesFromElement(textProps.editableDivNode);
            console.log('_textNodes', _textNodes);
            var _flattenReadyItems = getFlattenReadyItems(_textNodes);

            console.log('_flattenReadyItems', _flattenReadyItems);
            return buildTextProcText(_flattenReadyItems);
        }
        function clearEditor(){
            while(textProps.editableDivNode.firstChild){
                textProps.editableDivNode.removeChild(textProps.editableDivNode.firstChild);
            }
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
            var lastStyle = {
              font: null
            };
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
                console.log('pFlattenedItem',pFlattenedItem);
                var hasRunChange = false;
                var thisStyleRun = '';
                if (pFlattenedItem.color !== lastColor)
                {
                    hasRunChange = true;
                    thisStyleRun += '<tc' + Tool$.webRGB2Int(pFlattenedReadyItems[pIndex].color) + '>';
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

                if (pFlattenedItem.fontFamily !== lastStyle.font)
                {
                    hasRunChange = true;
                    thisStyleRun += '<fn' + getFontID(pFlattenedItem.fontFamily) + '>';
                    lastStyle.font = pFlattenedItem.fontFamily;
                    console.log('thisStyleRun',thisStyleRun);
                }


                if(pIndex === 0)
                {
                    styleRun += thisStyleRun;
                    styleRunLength += pFlattenedItem.text.length;
                    if(pILength === 1)
                    {
                        styleRun += pFlattenedItem.text.length + ' <..>';
                    }
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
            //var textProcFinal = renderEngine + boxFormat + '<fi' + FONTS.arial.include + '>' + '<fn' + FONTS.arial.fontid + '><ts3200>' + styleRun + textString + RETURN + '<EOT>' + TAB + RETURN;
            //var textProcFinal = '0111\n' +
              //  '\n' +
               // '300000000000000 300000000000000 0 0 0 0 0 0 1 0' + RETURN+ '<fi' + FONTS.arial.include + '>' + '<fn' + FONTS.arial.fontid + '><ts3200>' + styleRun + textString + RETURN + '<EOT>' + TAB + RETURN;

            var textProcFinal = renderHeader + '<fi' + FONTS.atypewriter.include + '>' + '<fi' + FONTS.zapfino.include + '><ts3600>' + styleRun + textString + renderEnd;
            // var textProcFinal = renderHeader + '<fi' + FONTS.arial.include + '>' + '<fn' + FONTS.arial.fontid + '><ts3200>' + styleRun + textString + renderEnd;
            console.log('textProcFinal',textProcFinal);
            textProps.styleRun = textProcFinal;
            prepareDownloadLink(textProps.styleRun);

        }

        function getFontID(fontFamily){

            var fontID;
            switch (fontFamily){
                case 'American_Typewriter':
                    fontID = FONTS.atypewriter.fontid;
                    break;
                case 'Zapfino':
                    fontID = FONTS.zapfino.fontid;
                    break;
            }
            return fontID;
        }

        function handleDownloadFileButton(){
            var downloadLinkElement = document.getElementById('downloadLink');
            downloadLinkElement.click();
            closeStyleRunDataView();
        }

        function prepareDownloadLink(text) {
            console.log('download action');
            var data = new Blob([text], {type: 'text/plain'});
            var url = window.URL.createObjectURL(data);

            var element = document.createElement('a');
            element.id = 'downloadLink';
            element.setAttribute('download','input.txt');
            element.setAttribute('href',url);

            var previousLink = document.querySelector('#downloadLink');

            while (previousLink)
            {
                previousLink.parentNode.removeChild(previousLink);
                previousLink = document.querySelector('#downloadLink');
            }

            document.body.appendChild(element);
        }

        function showDemo(bassData){
            bassTest.showDemo(bassData);
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
        function populateHTML(){
            console.log('textProps.styleRunData',textProps.styleRun);

            var styleRunData = textProps.styleRun;

            // var leftArrowPositions = [];






            var styleRunData = styleRunData.slice(styleRunData.indexOf('<'));

            styleRunData = removeFontParts(styleRunData);
            var textIndex = styleRunData.indexOf('<..>');
            var text = styleRunData.slice(textIndex + 4);
            if(text.indexOf('<EOT>') >= 0)
            {
                text = text.slice(0,text.indexOf('<EOT>'));
            }

            var styleRun = styleRunData.slice(0,textIndex-1);
            console.log('text', text);
            console.log('styleRun', styleRun);
            var soloStyleElements = styleRun.split(' ');
            console.log('soloStyleElements',soloStyleElements);
            var lastStyles = {
                color: 0,
                underline: false,
                font: 'atypewriter'

            };

            var styleElements = [];

            for (var i = 0, iLength = soloStyleElements.length; i < iLength; i++)
            {
                var styleElement, color, underline,font,stringLength;


                var styleStringTags = soloStyleElements[i].split('>');
                console.log('styleStringTags',styleStringTags);

                // Do not use last value as this will be the length of the style run
                for ( var j = 0, jLength = styleStringTags.length; j < jLength - 1; j++)
                {
                    if (styleStringTags[j].slice(1,3) === 'tc')
                    {
                        color = styleStringTags[j].slice(3);
                        underline = lastStyles.underline;
                        font = lastStyles.font;
                        lastStyles.color = color;
                    }
                    else if (styleStringTags[j].slice(1,2) === 'u')
                    {
                        color =  lastStyles.color;
                        underline = !lastStyles.underline;
                        font = lastStyles.font;
                        lastStyles.underline = underline;
                    }
                    else if (styleStringTags[j].slice(1,3) === 'fn')
                    {
                        color = lastStyles.color;
                        underline = lastStyles.underline;
                        font = styleStringTags[j].slice(3);
                        lastStyles.font = font;
                    }

                }

                styleElement = {
                    color: parseInt(color),
                    underline: underline,
                    font: font,
                    length: parseInt(styleStringTags[j])
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
                applyColorClassFromInt(span,styleElements[i].color);
                applyUnderlineClass(span,styleElements[i].underline);
                applyFontClass(span,styleElements[i].font);
                fragment.append(span);
            }

            console.log(fragment,fragment);

            while (textProps.editableDivNode.firstChild)
            {
                textProps.editableDivNode.removeChild(textProps.editableDivNode.firstChild);
            }
            textProps.editableDivNode.append(fragment);



        }

        function removeFontParts(pStyleRunData){
            console.log('removeFontParts() -- styleRunData',pStyleRunData);
            return pStyleRunData.replace(/\<fi[^\>.]*>/gm,'');
        }

        // functi

        function applyColorClassFromInt(span,colorInt)
        {
            var webRGB = Tool$.Int2webRGB(colorInt);
            applyInlineStyle(span,STYLES.color.prop,webRGB);
        }

        function applyInlineStyle(element,property,value){
            element.style.setProperty(property,value);
        }

        function applyUnderlineClass(span,pTruthy){
            if (pTruthy === true)
            {
                applyInlineStyle(span,STYLES.underline.prop,'underline');
            }
        }

        function applyFontClass(span, pFontID){
            console.log('applyFontClass, pFontID',pFontID);
            var stylesKey = Tool$.getKeyOfPropertyValue(STYLES,'fontid',pFontID);
            console.log('stylesKey',stylesKey);

            applyInlineStyle(span,STYLES[stylesKey].prop,STYLES[stylesKey].value);
        }

        function appendStyleRunData(){
            document.querySelector('#styleRunBox').style.display = 'block';
            document.querySelector('#styleRunData').innerText = textProps.styleRun;

        }

        function closeStyleRunDataView(){
            document.querySelector('#styleRunBox').style.display = 'none';
            document.querySelector('#styleRunData').innerText = '';
        }





    }

    window.textGUI$ = textGUI$;
})();
