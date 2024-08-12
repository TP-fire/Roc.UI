<template>
	<div style="width: 100%; height: 100%">
		<div class="headBox">
			<div class="titleText"><p>标题</p></div>
			<div class="titleBox">
				<input v-model="uriParam.title" class="titleInput" :placeholder="$t('pleaseEnter') + $t('title')">
			</div>
			<div class="btnbox">
                
				<Button class="btn" @click="saveArticle">保存</Button>
			</div>
		</div>
		<markdown-editor ref="markdownView" :init-data="content" />
	</div>
</template>
<script>

import {
	insertArticle,
	modifyArticle,
	getentity
} from '@/api/article.js'
import MarkdownEditor from './components/MarkdownEditor.vue'
export default {
	name: 'ArticleAdd',
	components: { MarkdownEditor },
	data() {
		return {
			dialogFormVisibleTitle: '新增文章',
			isAdd: true,
			initflag: false,
			content: '',
			uriParam: {
				id: '',
				title: '【无标题】'
			}
		}
	},
	created() {
		console.log('created加载')
		this.$nextTick(() => {
			console.log('activate')
			this.initContent()
		})
	},
	activated() {
		console.log('activated加载')
		this.$nextTick(() => {
			console.log('activate')
			this.initContent()
		})
	},
	beforeMount() {
		window.addEventListener('beforeunload', this.handleBeforeUnload)
	},
	beforeDestroy() {
		window.removeEventListener('beforeunload', this.handleBeforeUnload)
	},
	methods: {
		handleBeforeUnload(event) {
			// 在事件处理程序中添加保存提示的逻辑
			event.preventDefault()
			event.returnValue = '您确定要离开吗？请确认是否保存您的更改。'
		},
		initContent() {
			console.log('监听子组件加载完毕')
			const id = this.$route.query.id
			const title = this.$route.query.title
			if (id) {
				this.isAdd = false
				this.uriParam.id = id
				this.getContent()
			}
			if (title) {
				this.uriParam.title = title
			}
		},
		getContent() {
			if (!this.uriParam.id) {
				return
			}
			const obj = this.uriParam
			getentity(obj).then((res) => {
				if (res.code === 200) {
					this.$message({
						message: '获取数据成功',
						type: 'success',
						duration: 3000
					})
					// console.log(res.result.content)
					// console.log(this.$refs.markdown)
					// this.content = res.result.content
					this.$nextTick(() => {
						console.log(this.$refs)
						this.content = res.result.content
						// this.$refs.markdownView.setMarkdown(res.result.content)
					})
					// this.$refs.markdown.initEditor();
				} else {
					this.$message({
						message: `${this.$t('fail')}` + res.message,
						type: 'error',
						duration: 3000
					})
				}
			})
		},
		saveArticle() {
			console.log('保存文章')
			const contnet = this.$refs.markdownView.getMarkdown()
			const obj =	{ 'title': this.uriParam.title, 'content': contnet, 'id': this.uriParam.id }

			const requestApi = this.isAdd ? insertArticle : modifyArticle
			requestApi(obj).then((res) => {
				if (res.code === 200) {
					this.$message({
						message: this.isAdd ? '保存成功' : '修改成功',
						type: 'success',
						duration: 3000
					})
				} else {
					this.$message({
						message: `${this.$t('fail')}` + res.message,
						type: 'error',
						duration: 3000
					})
				}
			})
		},
		watchHtml() {
			console.log('watch')
			this.$refs['markdownView'].watch()
		},
		unwatchHtml() {
			console.log('unwatch')
			this.$refs['markdownView'].unwatch()
		},
		onlyView() {
			console.log('only')
			const markdown = this.$refs['markdownView']
			markdown.watch()
			markdown.previewing()
			markdown.hideCloseButton()
		}
	}
}
</script>
<style>
.headBox{
	background-color: #f3f3f3;
	align-items: center;
	flex-direction: row;
	display: flex;
}
.titleText{
	padding-left: 24px;
	display: block;
	font-weight: 500;
	font-size: large;
	width: 88px;
}
.titleBox{
	width: 100%;
	height: 56px;
	margin: 8px 16px 0px 8px;
	padding-right: 20px;
	position: relative;
}
.titleInput{
	width: 100%;
	margin-left: 4px;
	border-radius: 22px;
	border:1px solid #767967;
	padding: 8px;
	font-size: 18px;
	line-height: 24px;
}
.btnbox{
	padding: 4px 8px 12px 0;
	height: 60px;
	width: 20%;
	flex-direction: row;
	display: flex;
}
.btn{
	height: 100%;
	width: 100%;
	margin-right: 16px;
	padding: 0 16px;
	font-size: 16px;
	color: #fc5531;
	border: 1px solid #fc5531;
	border-radius: 22px;
	white-space: nowrap;
	background-color: #fff;
	cursor: pointer;
}
.btn:hover{
	background-color: rgb(16, 231, 27);
}
</style>
