<template>
	<div class="markdownBox">
		<div class="titleBox">
			<p>{{ uriParam.title }}</p>
		</div>
		<div class="contentBox">
			<markdown-preview ref="markdown" :value="content" />
		</div>
	</div>
</template>
<script>
import {
	getentity
} from '@/api/article.js'
import MarkdownPreview from './components/MarkdownPreview.vue'
export default {
	name: 'ArticlePreview',
	components: { MarkdownPreview },
	data() {
		return {
			content: '',
			uriParam: {
				id: '',
				title: ''
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.uriParam.id = this.$route.query.id
			this.uriParam.title = this.$route.query.title
			this.getContent()
		})
	},
	methods: {
		getContent() {
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
					this.content = res.result.content
					this.$refs.markdown.initEditor()
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
			this.$refs['markdown'].watch()
		},
		unwatchHtml() {
			this.$refs['markdown'].unwatch()
		},
		onlyView() {
			const markdown = this.$refs['markdown']
			markdown.watch()
			markdown.previewing()
			markdown.hideCloseButton()
		}
	}
}
</script>
<style>
.markdownBox{
	margin-top: -50px;
	margin-bottom: 30px;
	width: 100%;
	height: 100%;
	padding-left: 0%;
}
.contentBox{
	padding-left: 40px;
}
.titleBox{
	background-color: #f3f3f3;
	height: 120px;
	padding: 10px;
	font-size: 46px;
	align-items: center;
}
.titleBox p {
	text-align:center;
}
</style>
