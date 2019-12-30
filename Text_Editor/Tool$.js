(function(){
    'use strict';

    var Tool$ = function(){

        return {
            getUniqueArray: getUniqueArray,
            getKeyOfPropertyValue: getKeyOfPropertyValue,
            webRGB2Int: webRGB2Int,
            Int2webRGB: Int2webRGB
        };

        function getUniqueArray(pBloatedArray){
            var _uniqueArray = pBloatedArray.filter(function(item,pos,_this){
                return _this.indexOf(item) === pos;
            });
            return _uniqueArray;
        }


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
                value: 'American Typewriter',
                fontid: '0*0400*AMERICANTYPEWRITER'
            },
            color: {
                prop: 'color'
            }
        };

        function getKeyOfPropertyValue(pObject,property,value){
            var outKeys = Object.keys(pObject);
            for (var i = 0, iLength = outKeys.length; i < iLength; i++){
                if (pObject[outKeys[i]].hasOwnProperty(property) && pObject[outKeys[i]][property] === value){
                    return outKeys[i];
                }
            }
            return false;
        }

        /** Convert a CSS RGB Color to integer representation
         *
         * @param CSS webRGBColor (eg. rgb(0,0,0));
         * red = 15417909
         * @return Int
         */
        function webRGB2Int(pRGBColor)
        {
            var rgbColors = pRGBColor.match(/\d+(?=,|\))/g);
            console.log('rgbColors',rgbColors);
            console.log((parseInt(rgbColors[0]) * 65536),(parseInt(rgbColors[1]) * 256), + parseInt(rgbColors[2]));
            return ((parseInt(rgbColors[0]) * 65536) + (parseInt(rgbColors[1]) * 256) + parseInt(rgbColors[2]));
            // return (rgbColors[0] * 65536) + (rgbColors[1] * 256) + rgbColors[2];
        }


        /**
         * Int2webRGB
         * Convert an integer representation of a colour into an RGB colour
         *
         * @param pIntColour Integer (eg. 13151557)
         *
         * @return {string} (eg. rgb(0,255,0) )
         */
        function Int2webRGB(pIntColour)
        {
            var rValue;
            var gValue;
            var bValue;

            // calculate red
            rValue = Math.floor(pIntColour / 65536);
            pIntColour -= (rValue * 65536);

            // calculate green
            gValue = Math.floor(pIntColour / 256);
            pIntColour -= (gValue * 256);

            // calculate blue
            bValue = pIntColour;

            return 'rgb('+rValue+','+gValue+','+bValue+')';
        }
    }();

    window.Tool$ = Tool$;
})();