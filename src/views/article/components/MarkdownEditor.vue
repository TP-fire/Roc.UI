<template>
	<div class="markdown-editor-box" style="height: 100%">
		<link rel="stylesheet" href="./editor.md-master/css/editormd.min.css">
		<div :id="editorId" style="height: 100%" />
	</div>
</template>

<script>
import scriptjs from 'scriptjs'
import { defaultConfig } from '@/config/MarkdownConfig'

export default {
	name: 'MarkdownEditor',
	props: {
		editorId: {
			type: String,
			default: 'markdown-editor'
		},
		onchange: {
			type: Function
		},
		config: {
			type: Object,
			default: function() {
				return {}
			}
		},
		initData: {
			type: String,
			default: 'hello'
		},
		initDataDelay: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			editor: null,
			editorLoaded: false
		}
	},
	watch: {
		initData: function(newVal) {
			if (newVal) {
				this.editorLoaded && this.editor.setMarkdown(newVal)
			}
		}
	},
	mounted() {
		console.log('init editor')
		this.initEditor()
	},
	methods: {
		fetchScript(url) {
			return new Promise((resolve) => {
				scriptjs(url, () => {
					resolve()
				})
			})
		},
		getConfig() {
			return { ...defaultConfig, ...this.config }
		},
		getEditor() {
			return this.editor
		},
		getDoc() {
			return this.doc
		},
		watch() {
			return this.editor.watch()
		},
		unwatch() {
			return this.editor.unwatch()
		},
		previewing() {
			return this.editor.previewing()
		},
		getHTML() {
			return this.editor.getHTML()
		},
		getMarkdown() {
			return this.editor.getMarkdown()
		},
		setMarkdown(markdown) {
			return this.editor.setMarkdown(markdown)
		},
		initEditor() {
			(async() => {
				await this.fetchScript('./editor.md-master/jquery.min.js')
				await this.fetchScript('./editor.md-master/editormd.min.js')
				this.$nextTick(() => {
					const editor = window.editormd(this.editorId, this.getConfig())
					// console.log('init editor ', editor)
					editor.on('load', () => {
						setTimeout(() => {
							this.editorLoaded = true
							this.initData && editor.setMarkdown(this.initData)
							console.log('init timeout')
						}, this.initDataDelay)
					})
					this.onchange &&
						editor.on('change', () => {
							const html = editor.getPreviewedHTML()
							this.onchange({
								markdown: editor.getMarkdown(),
								html: html,
								text: window.$(html).text()
							})
						})
					this.editor = editor
				})
			})()
		}
	}
}
</script>

<style scoped lang="less"></style>
