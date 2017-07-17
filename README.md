2015年8月13日 15:22:29 v1.0
---
2015年9月21日 10:59:51 v2.0
----
1. **photo.js**
    * 定义一个MakePhoto对象，通过实例化可以使用
    * 主要作用：
        *  创建一个图片预览框，预览需要上传的图片，可以对图片进行移动，缩放，生成jpeg
    * 用法:
        <pre>
        var r = new MakePhoto({
            //把图片预览框创建在指定的id的div中
            id:'main',
            //图片预览框的大小
            size:{w:540,h:500},    
            //图片预览框的位置，相对于父节点
            pos:{x:25,y:21},
            //是否开启鼠标或者手指移动，缩放预览图功能
            touch:false,
            //针对安卓机的一个功能，开启相机选项，但从相机返回页面有可能造成刷新
            camera:true,
            //loading时候gif图和大小,不填写的话就也有预设好的
            loadImg:'static/img/loading.gif',
            loadSize:{w:150,h:150}
        });
        <pre>
    * 相关方法：
        * r.claaFile: 绑定在按钮上方法，作用：呼出相机或者图片选择工具
        * r.createImage(num): 传入质量参数(0~100)即可,生成图片JPEG格式，返回一个image url对象
        * r.scaleImg(num) : 填写传入一个缩放比例,有触摸功能的设备，可以在双指下缩放
    * 注意：
        * 占用了html的id，class有：myCanvas,upHandle,loadImg,makePhoto,preImg,Imgload
        * 还没解决安卓下圆角失效问题
2. **palette.js**
    * 定义一个Palette对象，通过实例化可以使用
    * 主要作用：
        * 通过创建一个画板来画画，可以通过内置方法切换画笔粗细，颜色，清空画板，生成jpeg和png图片
    * 用法：
        <pre>
        var p = new Palette({
            //把画板创建在指定的di的div里面
            id:'main',          
            //画板大小
            size:{w:WIDTH,h:HEIGHT},
            //画板位置，相对于父节点
            pos:{x:0,y:0},
            //画板背景颜色或者图片  颜色要用#来填写
            bg:'static/img/bg.jpg',  
            //画笔初始化大小
            touchSize:30,
            //画笔初始化颜色            
            color:'#FF00FF'
        });
        </pre>
    * 相关方法：
        * p.setTouchSize(s):更改画笔大小
        * p.setColor(c):更改画笔颜色
        * p.resetCanvas():重置画板
        * p.creatPNG():返回一个imageURL  png格式
        * p.createJPGE(p):传入质量参数(0~100)即可,返回一个imageURL
    * 注意：
        * 注意 占用html id两个：palette_canvas && palette
    * 增加橡皮擦功能的思路：
        * 背景图用img标签，或者div的bg-img代替，
        * canvas只用于作画，用ctxt.globalCompositeOperation="destination-out";来做橡皮擦功能
        * canvas生成一个png 在和背景图合并
3. **scratch.js**
    * 定义一个scratch对象，通过实例化可以使用
    * 主要作用：通过创建一个涂抹层和一个底层图片，实现刮刮乐功能
    * 用法：
        <pre>
        var s = new scratch({
            //把涂层创建在指定的di的div里面
            id:'main',                  
            //定义大小
            size:{w:WIDTH,h:HEIGHT},    
            //定义位置
            pos:{x:0,y:0},              
            //底层图片或者颜色 颜色要用#来填写，刮开后的层
            bottom:'static/img/bg.jpg',   
            //表层图片或者颜色 颜色要用#来填写，刮开前的层
            surface:'static/img/new_bg.jpg',   
            //表层透明度          
            alpha:0.9             
            //涂抹笔触大小
            touchSize:100,
            //涂抹到百分之几之后自动消失                 
            precent:0.9,          
            //刮到precent值的回调函数
            callBack:                    
        });
        </pre>
    * 相关方法：
         * r.resetCanvas()：重置刮层的函数，就会恢复没刮的时候
         * r.changeBottom()：更改底层的图片或者颜色。
    * 注意：占用html id有——scratch，scratch_canvas
4. **rotate.js**
    * 定义一个Rotate对象，通过实例化可以使用
    * 主要作用：通过创建一个转盘层。实现转盘抽奖功能
    * 用法：
        <pre>
        var r = new Rotate({
            //把转盘层创建在指定id的div里面
            id:'main',          
            //定义大小
            size:{w:486,h:486},
            //定义位置
            pos:{x:77,y:100},   
            //定义转盘图片
            bg:'static/img/pan.png',  
            //定义指针图片
            zhen:'static/img/zhen.png'  
        });
        </pre>
    * 相关方法：
        * rotate(time,angle)：指定时间和指定角度， time:秒数，angle:角度，再次rotate的时候需要reset才行
        * reSet()：重置回到原点，每次reSet之后setTimeout一个时间才再执行rotate
        * rotateJS()：无需设置速度事件，一直旋转，知道调用StopJS设置了FLAG角度的值才会停止。
        * StopJS()：用来停止rotateJS()引起的转动的
    * 注意
        * 占用id:rotate.
        * 如果使用rotateJS()，在安卓手机下需要开启该函数对应的转盘的3D加速
        * 但是如果使用rotate(time,angle)的话，请不要设置这段CSS 代码！
        <pre>
            id:rotate{-webkit-transform: translate3d(0, 0, 0);
            -webkit-backface-visibility: hidden;-webkit-perspective: 1000;}
        </pre>
5. **shake.js**
    * 定义一个Shake对象，通过实例化可以使用
    * 主要作用:实现摇动功能，可以自己设置回调函数来制作成摇一摇或者定时统计摇动次数的项目等
    * 用法：
      <pre>
        var func = function(){console.log('1');};
        var s = new Shake({
            //摇动阙值，越大的话，摇动幅度越大。默认为1000
            threshold:1000,   
            //摇动成功后的回调函数，默认为控制台输出一个shake字符
            fun:func    
        });
      </pre>  
    * 相关方法：
        s.open():开启摇动功能,回调函数是初始化的时候设置的那个
        s.close():关闭摇动功能
    * 注意：暂无
6. **tiger.js**
    * 暂时没写
    
