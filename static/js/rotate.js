/**
 * Created by sanyuelanv on 2015/8/10.
 */

/*
3.转盘
    2015年8月10日 12:06:34
    实例化一个转盘对象 :
    采用背景图分别是转盘和指针的双层div，绝对定位到指定位置，
    注意：
    两者尺寸一致，指针定位靠png图片定位到圆心
    占用html id有rotate。
    参数
    {
        id, //标签在这个id的层级里面新建一个div，就是我们的刮刮乐层
        size,//尺寸，填写方式是{w:XXX,h:XXX}
        pos, //位置，填写方式是{x:XXX,y:XXX}，左上角为圆角
        bg,  //圆盘图片地址
        zhen //指针图片地址
    }
    函数：

    rotate(time,angle) time:秒数，angle:角度，再次rotate的时候需要reset才行
    reSet()            重置回到原点，每次reSet之后setTimeout一个时间才再执行rotate
    不能设置速度，一直旋转，知道调用StopJS设置了FLAG角度的值才会停止。
    在安卓手机下需要开启该函数对应的转盘的3D加速；即在css中设置：
        #rotate{-webkit-transform: translate3d(0, 0, 0);-webkit-backface-visibility: hidden;-webkit-perspective: 1000;}
    注意：如果要用rotate的话，请不要设置这段CSS 代码！
    rotateJS()
    StopJS()
 */

var Rotate = function(value){
    var id = value.id || -1;
    var size = value.size || {w:'200',h:'200'};
    var pos = value.pos || {x:'0',y:'0'} ;
    var bg = value.bg || console.log('缺少参数');
    var zhen = value.zhen || console.log('缺少参数');
    var FLAG = 0;
    var action = undefined;
    var domID;
    this.rotateJS=function(){
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        var start = null;
        var angle = 0;
        var speed = 1;
        function step(timestamp){
            if(start==null){start = timestamp;}
            var progress = timestamp - start;
            angle+=speed;
            domID.style.webkitTransform = 'rotateZ('+angle+'deg)';
            domID.style.transform = 'rotateZ('+angle+'deg)';
            if(FLAG != 0){
                if(speed > 3){speed-=0.1;}
                else if(speed <= 3){
                    if(parseInt(angle%360) - FLAG == 0){return;}
                    if(parseInt((angle+1)%360) - FLAG == 0){return;}
                    if(parseInt((angle-1)%360) - FLAG == 0){return;}
                }
            }
            else{if(speed < 10){speed+=0.08;}}
            requestAnimationFrame(step);
        }
        action = requestAnimationFrame(step);
    };
    this.StopJS = function(angle){FLAG = angle;cancelAnimationFrame(action);};
    this.rotate=function(time,angle){
        var result=7200+angle;
        domID.style.webkitTransitionDuration=time+"ms";
        domID.style.webkitTransitionTimingFunction="cubic-bezier(0.3,0,0.3,1)";
        domID.style.webkitTransform="rotate("+result+"deg)";
        domID.style.transitionDuration=time+"ms";
        domID.style.transitionTimingFunction="cubic-bezier(0.3,0,0.3,1)";
        domID.style.transform="rotate("+result+"deg)";
    };
    this.reSet = function(){
        domID.style.webkitTransitionDuration = '0s';
        domID.style.transitionDuration = '0s';
        domID.style.webkitTransform ="rotate(0deg)";
        domID.style.transform ="rotate(0deg)";
    };
    var obj = {
        init:function(){obj.creatDom();},
        creatDom:function(){
            if(id==-1){var dom = document.getElementsByTagName('body')[0]}else{var dom = document.getElementById(id);}
            var style = "width:"+size.w+"px;height:"+size.h+"px;position:absolute;background-image:url("+bg+");overflow:hidden";
            var style2 = "width:"+size.w+"px;height:"+size.h+"px;position:absolute;background-image:url("+zhen+");overflow:hidden";
            var str = "<div id='rotate' style="+style+"></div>";
            var str2 = "<div style="+style2+"></div>";
            var style3 = "width:"+size.w+"px;height:"+size.h+"px;position:absolute;left:"+pos.x+"px;top:"+pos.y+"px;overflow:hidden";
            var str3 = "<div style="+style3+">"+str+str2+"</div>";
            dom.innerHTML = dom.innerHTML + str3;
            domID = document.getElementById('rotate');
        }
    };
    return obj.init();
};