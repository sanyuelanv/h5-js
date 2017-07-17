var scratch = function(value){
    /*初始化数据*/
    var id =  value.id || -1;
    var size = value.size || {w:'200',h:'200'};
    var pos = value.pos || {x:'0',y:'0'} ;
    value.bottom = value.bottom || '#000';
    var bottom_bg = (value.bottom.indexOf('#'))?"background-image:url("+value.bottom+")":"background-color:"+value.bottom;
    var surface_bg = value.surface || '#fff';
    var alpha = value.alpha || 1;
    var precent = value.precent || -1;
    var touchSize = value.touchSize || 1000;
    var callBack = value.callback || false;
    var isOver = false;
    this.resetCanvas = function(){
        ctxt.clearRect(0,0,size.w,size.h);
        ctxt.globalCompositeOperation="source-over";
        ctxt.globalAlpha =alpha;
        if(surface_bg.indexOf('#')==-1){
            var img = new Image();
            img.src = surface_bg;
            ctxt.drawImage(img,0,0,size.w,size.h);
        }
        else{
            ctxt.fillStyle = surface_bg;
            ctxt.fillRect(0,0,size.w,size.h);
        }
        ctxt.globalCompositeOperation="destination-out";
        ctxt.globalAlpha =1;
        isOver = false;
        area = 0;
    };
    this.changeBottom = function(bg){
        bg = bg || value.bottom;
        var div = document.getElementById('scratch');
        if(bg.indexOf('#')== -1){div.style.backgroundImage = 'url('+bg+')';}
        else{div.style.background = 'none';div.style.backgroundColor = bg;}
    };
    var canvas = undefined,ctxt = undefined,offset = {left:pos.x -1,top:pos.y - 1};
    var lines = [];
    var allArea = size.w * size.h;
    var mouse = false;
    var obj = {
        init:function(){obj.createDom();},
        createDom:function(){
            if(id==-1){var dom = document.getElementsByTagName('body')[0]}else{var dom = document.getElementById(id);}
            var style = "width:"+size.w+"px;height:"+size.h+"px;position:absolute;left:"+pos.x+"px;top:"+pos.y+"px;"+bottom_bg+';overflow:hidden';
            var str = "<div id='scratch' style='"+style+"'><canvas id='scratch_canvas' height='"+size.h+"' width='"+size.w+"'></canvas></div>";
            dom.innerHTML = dom.innerHTML + str;
            obj.creatCanvas();
        },
        creatCanvas:function(){
            canvas = document.getElementById('scratch_canvas');
            ctxt = canvas.getContext("2d");
            ctxt.globalAlpha =alpha;
            if(surface_bg.indexOf('#')==-1){
                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = surface_bg;
                img.onload = function() {ctxt.drawImage(img,0,0,size.w,size.h);obj.DrawIng();};
            }
            else{
                ctxt.fillStyle = surface_bg;
                ctxt.fillRect(0,0,size.w,size.h);
                obj.DrawIng();
            }
        },
        DrawIng:function(){
            /*这里用globalCompositeOperation而不是clearRect来做橡皮擦功能，主要为touchstart是画圆*/
            ctxt.globalCompositeOperation="destination-out";
            ctxt.globalAlpha =1;
            /*初始化一些数据:为了圆角和交角圆形*/
            ctxt.lineCap = "round";ctxt.lineJoin = "round";
            ctxt.pX = undefined;ctxt.pY = undefined;
            ctxt.lineWidth = touchSize;
            /*监听touch事件或者click*/
            var UA = navigator.userAgent;
            var isAndroid = /android|adr/gi.test(UA);
            var isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid;
            var isPC = !isAndroid && !isIos;
            if(isPC){
                canvas.addEventListener('mousedown',obj.startMouse,false);
                canvas.addEventListener('mousemove',obj.moveMouse,false);
                canvas.addEventListener('mouseup',obj.endMouse,false);
            }
            else{
                canvas.addEventListener('touchstart',obj.startTouch,false);
                canvas.addEventListener('touchmove',obj.moveTouch,false);
            }
        },
        startMouse:function(event){
            mouse = true;
            var id = 1;
            lines[id] ={x:event.pageX - offset.left,y:event.pageY-offset.top};
            ctxt.beginPath();
            ctxt.arc(lines[id].x,lines[id].y,ctxt.lineWidth/2,0,Math.PI*2,true);
            ctxt.closePath();
            ctxt.fill();
            event.preventDefault();
        },
        moveMouse:function(event){
            if(!mouse){return};
            var id = 1;
            var moveX = event.pageX - offset.left- lines[id].x;
            var moveY = event.pageY - offset.top - lines[id].y;
            var ret = obj.move(id,moveX,moveY);
            lines[id].x = ret.x;lines[id].y = ret.y;
            event.preventDefault();
        },
        endMouse:function(){mouse = false;event.preventDefault();},
        startTouch:function(event){
            for(var i=0;i<event.touches.length;i++){
                var touch = event.touches[i];
                var id = touch.identifier;
                lines[id] ={x:touch.pageX - offset.left,y:touch.pageY-offset.top};
                ctxt.beginPath();
                ctxt.arc(lines[id].x,lines[id].y,ctxt.lineWidth/2,0,Math.PI*2,true);
                ctxt.closePath();
                ctxt.fill();
                obj.calculate();
            };
            event.preventDefault();
        },
        moveTouch:function(event){
            for(var i=0;i<event.touches.length;i++){
                var touch = event.touches[i];
                var id = touch.identifier;
                var moveX = touch.pageX - offset.left- lines[id].x;
                var moveY = touch.pageY - offset.top - lines[id].y;
                var ret = obj.move(id, moveX, moveY);
                lines[id].x = ret.x;lines[id].y = ret.y;
            };
            event.preventDefault();
        },
        move:function(i,changeX, changeY) {
            ctxt.beginPath();
            ctxt.moveTo(lines[i].x, lines[i].y);
            ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
            ctxt.stroke();
            ctxt.closePath();
            obj.calculate();
            return { x: lines[i].x + changeX, y: lines[i].y + changeY };//返回最后的点坐标
        },
        calculate:function(l){
            if(precent==-1 || isOver){return;}
            var area=0;
            imageData = ctxt.getImageData(0,0,canvas.width,canvas.height);
            for (var i=0, ii=imageData.data.length; i<ii; i=i+4) {
                if(imageData.data[i]===0&&imageData.data[i+1]===0&&imageData.data[i+2]===0&&imageData.data[i+3]===0){area++;}
            }
            if(area/allArea>precent){
                isOver = true;
                ctxt.clearRect(0,0,size.w,size.h);
                if(callBack==false){console.log('shake!')}
                else{callBack();}
            }
        }
    };
    return obj.init();
}
