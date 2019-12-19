(function(){
    'use strict';

    var Tool$ = function(){

        return {
            getUniqueArray: getUniqueArray,
            RGB2Int: RGB2Int
        };

        function getUniqueArray(pBloatedArray){
            var _uniqueArray = pBloatedArray.filter(function(item,pos,_this){
                return _this.indexOf(item) === pos;
            });
            return _uniqueArray;
        }

        /** Convert a CSS RGB Color to integer representation
         *
         * @param CSS RGBColor (eg. rgb(0,0,0));
         * red = 15417909
         * @return Int
         */
        function RGB2Int(pRGBColor)
        {
            var rgbColors = pRGBColor.match(/\d+(?=,|\))/g);
            console.log('rgbColors',rgbColors);
            console.log((parseInt(rgbColors[0]) * 65536),(parseInt(rgbColors[1]) * 256), + parseInt(rgbColors[2]));
            return ((parseInt(rgbColors[0]) * 65536) + (parseInt(rgbColors[1]) * 256) + parseInt(rgbColors[2]));
            // return (rgbColors[0] * 65536) + (rgbColors[1] * 256) + rgbColors[2];
        }


        /**
         * Int2RGB
         * Convert an integer representation of a colour into an RGB colour
         *
         * @param pIntColour Integer (eg. 13151557)
         *
         * @return Object(RGBColour) (eg. {red:200, green:173, blue:69})
         */
        function Int2RGB(pIntColour)
        {
            var r; // 22
            var g; // 0
            var b; // 0

            // calculate red
            r = Math.floor(pIntColour / 65536); // 15417909 / 65536 = 235
            pIntColour -= (r * 65536); //

            // calculate green
            g = Math.floor(pIntColour / 256);
            pIntColour -= (g * 256);

            // calculate blue
            b = pIntColour;

            return {
                red: r,
                green: g,
                blue: b
            };
        }
    }();

    window.Tool$ = Tool$;
})();