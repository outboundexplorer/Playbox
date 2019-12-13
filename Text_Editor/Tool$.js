(function(){
    'use strict';

    var Tool$ = function(){

        return {
            getUniqueArray: getUniqueArray
        };

        function getUniqueArray(pBloatedArray){
            var _uniqueArray = pBloatedArray.filter(function(item,pos,_this){
                return _this.indexOf(item) === pos;
            });
            return _uniqueArray;
        }
    }();

    window.Tool$ = Tool$;
})();