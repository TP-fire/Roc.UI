<template>
    <div class="drag-box">
        <div class="drag-left" id="source">
                <div class="item" :id="item.id" v-for="item in arr1" :key="item.id" draggable="true">{{item.name}}</div>
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
            this.backgroundListener()           

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
                    console.log("鼠标位置",event,this.isGetTarget)
                   

                    //获取到目标元素
                    if(this.isGetTarget){
                          const { pageX,pageY } = event;
                         let {x,y,top,left,right,bottom,width,height} = this.targetElement.getBoundingClientRect();//获取目标元素的位置
                         console.log("width,height",width,height)

                        this.dragBackground.style.zIndex=2;                         
                        this.dragBackground.style.left=`${left}px`;
                        this.dragBackground.style.top=`${top}px`;
                        if (this.targetElement.classList.contains("dropzone")) {                       
                            this.dragBackground.style.width=`${width}px`;
                            this.dragBackground.style.height=`${height}px`;
                        }else{
                            //判断鼠标位置在目标元素的上下左右
                            //左边
                            if(pageX>left&&pageX<left+width*1/3){
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
                            else if(pageY>top&&pageY<top+height*1/3){
                                this.currentPosition="top";
                                this.dragBackground.style.width=`${width}px`;
                                this.dragBackground.style.height=`${height/2}px`;
                            }
                            //下面
                            else if(pageY>top+height*2/3){
                                this.currentPosition="bottom";
                                this.dragBackground.style.top=`${top+height/2}px`;
                               this.dragBackground.style.width=`${width}px`;
                               this.dragBackground.style.height=`${height/2}px`; 
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
					// 设置为半透明
					event.target.classList.add("dragging");
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
                    console.log("阻止默认行为（会作为某些元素的链接打开）",event)
					// 阻止默认行为（会作为某些元素的链接打开）
					event.preventDefault();
					// 将被拖动元素移动到选定的目标元素中
					if (this.targetElement.classList.contains("dropzone")) {
                        const {offsetHeight,offsetLeft,offsetTop,offsetWidth} = this.targetElement;
                        let draged = this.config.draged;
                        draged.style.position='absolute';
                        draged.style.left=offsetLeft;
                        draged.style.top=offsetTop;
                        draged.style.height=`${offsetHeight}px`;
                        draged.style.width=`${offsetWidth}px`;;
						this.targetElement.classList.remove("dragover");
						// 删除自身
						// config.draged.parentNode.removeChild(config.draged);
						this.targetElement.appendChild(draged);
					}else if(this.targetElement.classList.contains("item")){
                        console.log("this.this.dragBackground",this.dragBackground)
                         let {x,y,top,left,right,bottom,width,height} = this.dragBackground.getBoundingClientRect();//获取目标元素的位置
                                                                        
                        // const {offsetHeight,offsetLeft,offsetTop,offsetWidth} = this.targetElement;
                        let draged = this.config.draged;
                        draged.style.height=`${height}px`;
                        draged.style.width=`${width}px`;
                        draged.style.position='absolute';
                        draged.style.left=`${left}px`;
                        draged.style.top=`${top}px`;
						this.targetElement.classList.remove("dragover");
						// 删除自身
						// config.draged.parentNode.removeChild(config.draged);
						 this.targetElement.parentNode.appendChild(draged);
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
                        }
                    }

                    // 拖动结束，重置透明度
                    this.isGetTarget=false;
                    this.dragBackground.style.zIndex=-1;
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
                    console.log("阻止默认行为（会作为某些元素的链接打开）",event)
					// 阻止默认行为（会作为某些元素的链接打开）
					event.preventDefault();
					// 将被拖动元素移动到选定的目标元素中
					if (this.targetElement.classList.contains("dropzone")) {
                        const {offsetHeight,offsetLeft,offsetTop,offsetWidth} = this.targetElement;
                        let draged = this.config.draged;
                        draged.style.position='absolute';
                        draged.style.left=offsetLeft;
                        draged.style.top=offsetTop;
                        draged.style.height=`${offsetHeight}px`;
                        draged.style.width=`${offsetWidth}px`;;
						this.targetElement.classList.remove("dragover");
						// 删除自身
						// config.draged.parentNode.removeChild(config.draged);
						this.targetElement.appendChild(draged);
					}else if(this.targetElement.classList.contains("item")){
                        console.log("this.this.dragBackground",this.dragBackground,this.config.draged,this.config.draged.id)
                         let {x,y,top,left,right,bottom,width,height} = this.dragBackground.getBoundingClientRect();//获取目标元素的位置
                                                                        
                        // const {offsetHeight,offsetLeft,offsetTop,offsetWidth} = this.targetElement;
                        let draged = this.config.draged;
                        draged.style.height=`${height}px`;
                        draged.style.width=`${width}px`;
                        draged.style.position='absolute';
                        draged.style.left=`${left}px`;
                        draged.style.top=`${top}px`;
						this.targetElement.classList.remove("dragover");
						// 删除自身
						// config.draged.parentNode.removeChild(config.draged);
						 this.targetElement.parentNode.appendChild(draged);
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
                        }                      
                    }

                    //为拖拽的子元素增加监听事件
                    const dragId = this.config.draged.id;
                    this.sourceListener(dragId);
                    this.targetListener(dragId);

                    // 拖动结束，重置透明度
                    this.isGetTarget=false;
                    this.dragBackground.style.zIndex=-1;
				});
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