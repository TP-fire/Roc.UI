<template>
    <div class="drag-box">
        <div class="drag-left" id="source">
                <div class="item" :id="item.id" v-for="item in arr1" :key="item.id" draggable="true">{{item.name}}---{{item.id}}</div>
        </div>
        <div class="drag-right dropzone" id="droptarget">
        </div>
        <div id="drag-background" style=" width: 100px; height: 100px; background: #ccc;position:absolute;top:0;left:0;;opacity: 1;z-index:-1"></div>
    </div>
</template>
<script>

export default{
    components: {},
	name: "drag-dashboard",
	components: { },
	data() {
		return {
              arr1: [
                        { id: 1, name: 'www.itxst.com' },
                        { id: 2, name: 'www.jd.com' },
                        { id: 3, name: 'www.baidu.com' },
                        { id: 4, name: 'www.taobao.com' }
                    ],
                config:{
                    draged:null
                },
                targetElement:"",//目标元素
                dragElement:"",//拖拽的元素
                dragBackground:"",//
                isGetTarget:false,//是否到达目标元素
                currentPosition:"left",//拖拽元素位置
                
		};
	},
	mounted() {
        this.init();
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		next();
	},
	methods: {
       init() {
            // 灰色布局div
            this.backgroundListener(); 
            // 源元素监听 参数：id
            this.sourceListener("source");
            // 目标元素（父元素）监听 参数：id
            this.targetListener("droptarget");
			},
        // 源元素监听 参数：id
        sourceListener(id){
            /* 在可拖动的目标上触发的事件 */
            const source = document.getElementById(id);
            source.addEventListener("drag", (event) => {
                //获取到目标元素
                if(this.isGetTarget){
                    const { pageX,pageY } = event;
                    let {x,y,top,left,right,bottom,width,height} = this.targetElement.getBoundingClientRect();//获取目标元素的位置
                    // console.log("width,height",width,height)

                    this.dragBackground.style.zIndex=2;                         
                    this.dragBackground.style.left=`${left}px`;
                    this.dragBackground.style.top=`${top}px`;
                    switch(true){
                      //拖拽到底层div
                      case this.targetElement.classList.contains("dropzone"):
                         this.dragBackground.style.width=`${width}px`;
                          this.dragBackground.style.height=`${height}px`;
                        break;
                      //内部元素拖拽 或
                      //从外层拖拽元素到拖拽到底层div
                      default:
                          //判断鼠标位置在目标元素的上下左右
                        //左边
                        if(pageX>left&&pageX<=left+width*1/3){
                            this.currentPosition="left";
                          this.dragBackground.style.width=`${width/2}px`;
                          this.dragBackground.style.height=`${height}px`;
                        }
                        //右边
                        else if(pageX>left+width*2/3){
                            this.currentPosition="right";
                            this.dragBackground.style.left=`${left+width/2}px`;
                            this.dragBackground.style.width=`${width/2}px`;
                            this.dragBackground.style.height=`${height}px`;
                        }
                        //上面
                        else if(pageY>top&&pageY<top+height*1/2){
                            this.currentPosition="top";
                            this.dragBackground.style.width=`${width}px`;
                            this.dragBackground.style.height=`${height/2}px`;
                        }
                        //下面
                        else if(pageY>top+height*1/2){
                            this.currentPosition="bottom";
                            this.dragBackground.style.top=`${top+height/2}px`;
                            this.dragBackground.style.width=`${width}px`;
                            this.dragBackground.style.height=`${height/2}px`; 
                        }
                        //说明是内部拖拽元素 并且是居中 说明是内部元素替换
                        if(this.config.draged.classList.contains("bi-element")&&pageX>left&&pageY>top&&pageX>=left+width*1/3&&pageX<=left+width*2/3&&pageY>=top+height*1/3&&pageY<=top+height*2/3){
                          this.currentPosition="center";
                          this.dragBackground.style.top=`${top}px`;
                          this.dragBackground.style.width=`${width}px`;
                          this.dragBackground.style.height=`${height}px`; 
                        }
                    }
                   
                }else{
                    this.dragBackground.style.zIndex=-1;
                }
            });

            source.addEventListener("dragstart", (event) => {
                this.isGetTarget=false;
                this.targetElement="";
                // 保存被拖动元素的引用
                this.config.draged = event.target;               
            });

            source.addEventListener("dragend", (event) => {
                // 拖动结束，重置透明度
                this.isGetTarget=false;
                this.dragBackground.style.zIndex=-1;              
            });
        },
        // 目标元素（父元素）监听 参数：id
        targetListener(id){
            /* 在放置目标上触发的事件 */
            const target = document.getElementById(id);
            target.addEventListener(
                "dragover",
                (event) => {
                    // 阻止默认行为以允许放置
                    event.preventDefault();
                },
                false,
            );

            target.addEventListener("dragenter", (event) => {
                console.log("在可拖动元素进入潜在的放置目标时高亮显示该目标",event);
                    this.targetElement=event.target;
                    this.isGetTarget=true;
                // 在可拖动元素进入潜在的放置目标时高亮显示该目标
                if (event.target.classList.contains("dropzone")) {
                    // const {offsetHeight,offsetLeft,offsetTop,offsetWidth} = event.target;
                    // this.config.draged.style.position='absolute';
                    // this.config.draged.style.left=offsetLeft;
                    // this.config.draged.style.top=offsetTop;
                    // this.config.draged.style.height=`${offsetHeight}px`;
                    // this.config.draged.style.width=`${offsetWidth}px`;;
                    // event.relatedTarget.style.background='red';
                //    event.dataTransfer.setDragImage(dragImage, offsetWidth, offsetHeight); // 设置自定义拖拽镜像
                }
            });

            target.addEventListener("dragleave", (event) => {
                // 在可拖动元素离开潜在放置目标元素时重置该目标的背景
                if (event.target.classList.contains("dropzone")) {
                    event.target.classList.remove("dragover");
                }
            });

            target.addEventListener("drop", (event) => {
                // 阻止默认行为（会作为某些元素的链接打开）
                event.preventDefault();
                });
        },
        //背景颜色 灰色布局
        backgroundListener(){
             this.dragBackground = document.getElementById('drag-background');
             //允许背景图片放置
            this.dragBackground.addEventListener(
                "dragover",
                (event) => {
                    // 阻止默认行为以允许放置
                    event.preventDefault();
                },
                false,
            );

            this.dragBackground.addEventListener("drop", (event) => {
                    // console.log("阻止默认行为（会作为某些元素的链接打开）",event)
                  // 阻止默认行为（会作为某些元素的链接打开）
                  event.preventDefault();
                  // 将被拖动元素移动到选定的目标元素中
                  const classList = this.targetElement.classList;    
                  let {x,y,top,left,right,bottom,width,height} = this.dragBackground.getBoundingClientRect();//获取灰色块元素的位置
                  const {x:targetX,y:targetY,top:targetTop,left:targetLeft,right:targetRight,bottom:targetBottom,width:targetWidth,height:targetHeight} = this.targetElement.getBoundingClientRect();//目标元素的位置
                  const {x:sourceX,y:sourceY,top:sourceTop,left:sourceLeft,right:sourceRight,bottom:sourceBottom,width:sourceWidth,height:sourceHeight} = this.config.draged.getBoundingClientRect();//源元素的位置
                  console.log("top,left,sourceTop,sourceLeft",top,left,width,height,sourceTop,sourceLeft,sourceWidth,sourceHeight)
                  let draged = this.config.draged;//克隆元素
                  draged.style.position='absolute'; 
                  draged.style.height=`${height}px`;
                  draged.style.width=`${width}px`;
                  draged.style.left=`${left}px`;
                  draged.style.top=`${top}px`;
                 
                  switch(true){
                    case classList.contains("dropzone"):                                             
                        this.targetElement.appendChild(draged);
                      break;
                    //内容区域手动调整拖拽
                    // case this.config.draged.classList.contains("bi-element"):
                    //   console.log("内容区域手动调整拖拽");
                    //   break;
                    case classList.contains("item"):     
                        this.targetElement.style.width=`${width}px`;
                        this.targetElement.style.height=`${height}px`;                      
                        //修改目标元素位置
                        switch(this.currentPosition){
                            case 'left':
                                this.targetElement.style.left=`${left+width}px`;
                                break;
                            case 'right':
                                  this.targetElement.style.left=`${left-width}px`;
                                break;
                            case 'top':
                                  this.targetElement.style.top=`${top+height}px`;
                                break;
                            case 'bottom':
                                  this.targetElement.style.top=`${top-height}px`;
                                break;
                            case "center":
                                 this.targetElement.style.left=`${sourceLeft}px`;
                                 this.targetElement.style.top=`${sourceTop}px`;
                                 this.targetElement.style.height=`${sourceHeight}px`;
                                 this.targetElement.style.width=`${sourceWidth}px`;
                                 break;
                        }  
                        this.targetElement.parentNode.appendChild(draged);                       
                      break;
                  }              

                 


                  //内容区域手动调整拖拽 ----当布局 不是整块调整时，调整全部区域的布局  
                  //最外层父元素信息                
                  const {x:parentX,y:parentY,top:parentTop,left:parentLeft,right:parentRight,bottom:parentBottom,width:parentWidth,height:parentHeight} =  document.getElementById("droptarget").getBoundingClientRect();
                  console.log("最外层父元素信息","parentTop",parentTop,"parentLeft",parentLeft,"parentRight",parentRight,"parentWidth",parentWidth,"parentHeight",parentHeight)
                  console.log("目标元素","top",top,"left",left,"right",right,"width",width,"height",height)
                   console.log("源元素","sourceTop",sourceTop,"sourceLeft",sourceLeft,"sourceRight",sourceRight,"sourceWidth",sourceWidth,"sourceHeight",sourceHeight)
                  console.log("this.config.draged.classList",this.config.draged.classList)
                  if(this.config.draged.classList.contains("bi-element")&&this.currentPosition!=='center'){
                    // 获取调整区域的div
                    // 获取目标元素和源元素的影响范围
                    const startX = parentLeft;
                    const startY = parentTop;
                    const endX = parentRight;
                    const endY = parentBottom;
                    console.log(startX,startY,endX,endY, "区域元素",this.getDivsInArea(startX, startY, endX, endY));
                    //区域内的所有元素
                    const allElement = this.getDivsInArea(startX, startY, endX, endY); 
                    allElement.forEach(div=>{div.row=false;div.column=false;}) //记录是否横纵调整
                    console.log("区域内的所有元素",allElement)
                    if(['top','bottom'].includes(this.currentPosition)){
                      //先列后行
                      //从第一列开始横向扩展 最后一个参数是调整区域的结束位置
                      this.$nextTick(()=>{
                        this.columnExtend(startX, startY, startX+10, endY,endX,'column')   
                      })
                      //从第行列开始纵向扩展 最后一个参数是调整区域的结束位置
                      this.$nextTick(()=>{
                        this.rowExtend(startX, startY, endX, startY+10,endY,'row')    
                      })
                    }else{
                      //从第行列开始纵向扩展 最后一个参数是调整区域的结束位置
                      this.$nextTick(()=>{
                        this.rowExtend(startX, startY, endX, startY+10,endY,'row')    
                      })
                       //从第一列开始横向扩展 最后一个参数是调整区域的结束位置
                      this.$nextTick(()=>{
                        this.columnExtend(startX, startY, startX+10, endY,endX,'column')   
                      })
                    }
                    
                    
                            
                    
                    
                  }

                   //为拖拽的子元素增加监听事件
                  const dragId = draged.id;
                  this.sourceListener(dragId);
                  this.targetListener(dragId);
                  this.config.draged.classList.add("bi-element");// 添加类名     

                  // 拖动结束，重置透明度
                  this.isGetTarget=false;
                  this.dragBackground.style.zIndex=-1;
                });
        },
        //按列扩展
        columnExtend(startX, startY, endX, endY,standardEndX,type){ 
          if(startX<=standardEndX){
            const areaElement = this.getDivsInArea(startX, startY, endX, endY,type);
            // console.log("按列扩展内嵌div-----",areaElement)
            let deleteHeight =0;
            if(areaElement.length>0){
            
              // const filterAreaElement = Array.from(areaElement).filter(div=>parseFloat(div.style.width)!==standardEndX-startX);
              
              let columnWidth = Math.min( ...Array.from(areaElement).map(div=>parseFloat(div.style.width)));
              // console.log("按列扩展-----最小宽为单位靠右扩展",columnWidth,Array.from(areaElement).map(div=>parseFloat(div.style.width)))

            // console.log("按列扩展-----columnWidth",columnWidth,"区域元素",areaElement)
             Array.from(areaElement).filter(div=>div[type]===true).forEach(div=> deleteHeight+=parseFloat(div.style.height));
            let firstSumHeight = -deleteHeight;
            let totalHeight = (endY-startY)-deleteHeight;
            areaElement.forEach(div=>firstSumHeight+=parseFloat(div.style.height));
            //总高度和调整区域高度相同 则不调整
            // console.log("按列扩展-----totalHeight",totalHeight,firstSumHeight)
            if(totalHeight!==firstSumHeight&&areaElement.length>0){
              //扩展比例
              const n = totalHeight / ((firstSumHeight/totalHeight)*totalHeight);   
              // console.log("纵向扩展比例-------",n) 
              if(n !== Infinity){
                 let addHeight = startY;
                // console.log("按列扩展-----纵向扩展比例",n,addHeight,firstSumHeight,totalHeight)
                //等比例扩展
                  areaElement.forEach((div,divIndex)=>{
                    // console.log("按列扩展-----addHeight",addHeight,div[type],div)
                    if(div[type]!==true){
                      const height = parseFloat(div.style.height);
                      const percent = height / firstSumHeight;//宽高占比
                      div.style.height = `${height * n}px`;
                      div.style.top = `${addHeight}px`;
                      div.style.left = parseFloat(divIndex!=0?areaElement[divIndex-1].style.left:areaElement[0].style.left)
                      div[type]=true;
                      addHeight += height * n;
                      // console.log("div.style.height",div.style.height,height,percent)
                      // console.log("高度",height * n,"left",addHeight)
                    }else{
                      div.style.top = `${addHeight}px`;
                      div.style.left = parseFloat(divIndex!=0?areaElement[divIndex-1].style.left:areaElement[0].style.left)
                      addHeight +=parseFloat(div.style.height);
                    }
                  })
              }   
              
            }else if(areaElement.length>0){
              areaElement.forEach(div=>{
                div[type]=true;
                // console.log("top:",div.style.top,"left:",div.style.left,div)
              });
              // console.log("列已铺满 ",areaElement)

            }
            this.columnExtend(columnWidth+startX, startY, columnWidth+startX+10, endY,standardEndX,'column')
            }  
            
            
          }    
        },
         //按行扩展
        rowExtend(startX, startY, endX, endY,standardEndY,type){ 
          if(startY<=standardEndY){
            const areaElement = this.getDivsInArea(startX, startY, endX, endY,type);   
            let deleteWidth =0;
            // console.log("areaElement",areaElement)
             if(areaElement.length>0){ 
              //  const filterAreaElement = Array.from(areaElement).filter(div=>parseFloat(div.style.height)!==standardEndY-startY);
              // let columnHeight = filterAreaElement.length>0?parseFloat(filterAreaElement[0].style.height):parseFloat(areaElement[0].style.height)

              let columnHeight = Math.min( ...Array.from(areaElement).map(div=>parseFloat(div.style.height)));
              //  console.log("按行扩展-----最小宽为单位靠下扩展",columnHeight,Array.from(areaElement).map(div=>parseFloat(div.style.height)))

              
                Array.from(areaElement).filter(div=>div[type]===true).forEach(div=> deleteWidth+=parseFloat(div.style.width));

                //获取第一行第一列的总高度
                let firstSumWidth = -deleteWidth;
                let totalWidth = (endX-startX)-deleteWidth;
                areaElement.forEach(div=>firstSumWidth+=parseFloat(div.style.width));
                //总宽度和调整区域宽度相同 则不调整
                if(totalWidth!==firstSumWidth&&areaElement.length>0){
                //扩展比例
                const n = totalWidth / ((firstSumWidth/totalWidth)*totalWidth);
                 if(n !== Infinity){
                  let addWidth = startX;
                  // console.log("横向扩展比例",n,addWidth,firstSumWidth,totalWidth)
                  //等比例扩展
                    areaElement.forEach((div,divIndex)=>{
                      // console.log("div[type]",div[type])
                      if(div[type]!==true){
                        // console.log("addWidth",addWidth)
                        const width = parseFloat(div.style.width);
                        div.style.width = `${width * n}px`;
                        div.style.left = `${addWidth}px`;
                        div.style.top = parseFloat(divIndex!=0?areaElement[divIndex-1].style.top:areaElement[0].style.top)
                        div[type]=true;
                        // console.log("div",divIndex,div)
                        addWidth += width * n;
                        // console.log("宽度",width * n,"left",addWidth,"往左偏移量",addWidth)
                      }else{
                        div.style.left = `${addWidth}px`;
                        div.style.top = parseFloat(divIndex!=0?areaElement[divIndex-1].style.top:areaElement[0].style.top)
                        addWidth +=parseFloat(div.style.width);
                      }
                      
                    })
                 }
                }else if(areaElement.length>0){
                  areaElement.forEach(div=>{
                    div[type]=true;
                    // console.log(div.style.height,div.style.width,div.style.top,div.style.left,div.style.width)
                  });
                  // console.log("行已铺满 ",areaElement)
                }
                // console.log("startX, columnHeight+startY,endX,  columnHeight+startY+10,standardEndY",startX, columnHeight+startY,endX,  columnHeight+startY+10,standardEndY)
                this.rowExtend(startX, columnHeight+startY,endX,  columnHeight+startY+10,standardEndY,'row')
                
             }
          }    
        },
        //获取指定区域内的元素
        getDivsInArea(startX, startY, endX, endY,type) {
            console.log("获取指定区域内的元素",startX, startY, endX, endY)
             const divs = document.querySelectorAll('#droptarget div');
             //排序
             const sortedElements = Array.from(divs).sort((a, b) => {
                const rectA = a.getBoundingClientRect();
                const rectB = b.getBoundingClientRect();
                //按列排序
                if(type==='row'){
                     if (rectA.left === rectB.left) {
                      return rectA.top - rectB.top;
                    }
                    return rectA.left - rectB.left;
                }else{
                    if (rectA.top === rectB.top) {
                      return rectA.left - rectB.left;
                    }
                    return rectA.top - rectB.top;
                }
                
               
            });
            const result = [];

            sortedElements.forEach(div => {
                const rect = div.getBoundingClientRect();
                const divX = rect.left;
                const divY = rect.top;
                const divWidth = rect.width;
                const divHeight = rect.height;
                if (divX < endX && divX + divWidth > startX && divY < endY && divY + divHeight > startY) {
                    result.push(div);
                }
            });
             console.log("result",result)
            return result;
        }

    },

}
</script>
<style scoped lang="less">
.drag-box{
    height: 100%;
    padding:20px;
    display: flex;
    .drag-left{
        width: 500px;
        height: 100%;
        .item{
               padding: 10px;
                background: #0188fb21;
                margin: 10px;
        }
    }
    .drag-right{
        display: inline-block;
        width:calc(100% - 500px);
            background: #cccccc36;
            .item{
                background: #27ce8842;
                border:1px solid #fff;
        }
    }
}
</style>