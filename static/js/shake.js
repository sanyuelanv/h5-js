/**
 * Created by sanyuelanv on 2015/8/14.
 */
var Shake = function(value){
    var Threshold = value.threshold ||1000;
    var fun = value.fun || 0;
    var last_update = 0;
    var x, y, z, last_x,last_y,last_z=0;
    var num = 0;
    var isOn = false;
    this.open = function(){
        if(isOn){return}
        if(window.DeviceMotionEvent){
            window.addEventListener('devicemotion',shakeHandler,false);
            console.log('open');
            isOn = true;
        }
    };
    function shakeHandler(eventData) {
        var acceleration =eventData.accelerationIncludingGravity;
        var myDate = new Date();var curTime = myDate.getTime();
        if ((curTime-last_update)> 100) {
            var diffTime = curTime -last_update;last_update = curTime;
            x = acceleration.x;y = acceleration.y;z = acceleration.z;
            var speed = Math.abs(x+y+z-last_x-last_y-last_z)/diffTime*10000;
            if (speed > Threshold) {
                if(fun==0){console.log('shake!')}
                else{fun();}
            }
            last_x = x;last_y = y;last_z = z;
        }
    }
    this.close = function(){
        if(isOn){
            window.removeEventListener('devicemotion',shakeHandler,false);
            console.log('close');
            isOn = false;
        }
    }
};