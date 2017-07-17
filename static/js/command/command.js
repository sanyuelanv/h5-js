window.FIXWIDTH = (function(win, doc) {
    var UA = navigator.userAgent,
        isAndroid = /android|adr/gi.test(UA),
        isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
        isWeixin = /MicroMessenger/gi.test(UA),
        isPC = !isAndroid && !isIos;
    return {
        isAndroid: isAndroid,
        isIos: isIos,
        isPC:isPC,
        isWeixin:isWeixin,
        fixScreen: function(width) {
            //移动端版本兼容
            if(isAndroid){
                var version = parseFloat(RegExp.$1);
                if(version>2.3){
                    var phoneScale = parseInt(window.screen.width) / width;
                    document.write('<meta name="viewport" content="width='+width+', minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
                }
                else{
                    document.write('<meta name="viewport" content="width='+width+', target-densitydpi=device-dpi">');
                }
            }
            else if(!isPC){
                document.write('<meta name="viewport" content="width='+width+', user-scalable=no, target-densitydpi=device-dpi">');
            }
        }
    };
})(window, document);
/*定宽设置，附带UA查询功能，判读是否为安卓，ios，微信中，PC上*/
FIXWIDTH.fixScreen(640);

