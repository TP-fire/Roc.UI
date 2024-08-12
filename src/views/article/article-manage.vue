<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
				<el-option v-for="item in articleType" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
			</el-select>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				Search
			</el-button>
		</div>

		<el-table
			:key="tableKey"
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%;"
			@sort-change="sortChange"
		>
			<el-table-column label="ID" prop="id" sortable="custom" align="center" width="100px" :class-name="getSortClass('id')">
				<template slot-scope="{row}">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Date" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.createDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Title" min-width="100px">
				<template slot-scope="{row}">
					<span class="link-type" @click="preview(row)">{{ row.title }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Author" width="110px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.createUserName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Status" class-name="status-col" width="100">
				<template slot-scope="{row}">
					<el-tag :type="row.enabled | statusFilter">
						{{ row.enabled }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini" @click="editClick(row)">
						Edit
					</el-button>
					<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteClick(row)">
						Delete
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="pageConfig.pageIndex" :limit.sync="pageConfig.pageSize" @pagination="getList" />

		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
				<el-form-item label="Type" prop="type">
					<el-select v-model="temp.type" class="filter-item" placeholder="Please select">
						<el-option v-for="item in articleType" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="Date" prop="timestamp">
					<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
				</el-form-item>
				<el-form-item label="Title" prop="title">
					<el-input v-model="temp.title" />
				</el-form-item>
				<el-form-item label="Status">
					<el-select v-model="temp.status" class="filter-item" placeholder="Please select">
						<el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
				<el-form-item label="Imp">
					<el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
				</el-form-item>
				<el-form-item label="Remark">
					<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
					Cancel
				</el-button>
				<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
					Confirm
				</el-button>
			</div>
		</el-dialog>

		<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
			<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
				<el-table-column prop="key" label="Channel" />
				<el-table-column prop="pv" label="Pv" />
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getpagelistReq, insertArticle, modifyArticle, deleteArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const articleType = [
	{ key: 'CN', display_name: 'China' },
	{ key: 'US', display_name: 'USA' },
	{ key: 'JP', display_name: 'Japan' },
	{ key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = articleType.reduce((acc, cur) => {
	acc[cur.key] = cur.display_name
	return acc
}, {})

export default {
	name: 'ArticleManage',
	components: { Pagination },
	directives: { waves },
	filters: {
		statusFilter(status) {
			const statusMap = {
				1: 'success',
				0: 'danger'
			}
			return statusMap[status]
		},
		typeFilter(type) {
			return calendarTypeKeyValue[type]
		}
	},
	data() {
		return {
			tableKey: 0,
			list: [], // 数据
			total: 0,
			listLoading: true,
			listQuery: {
				id: '',
				title: '',
				content: ''
			},
			pageConfig: {
				pageSize: 30,
				pageIndex: 1
			},
			importanceOptions: [1, 2, 3],
			articleType,
			sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
			statusOptions: ['published', 'draft', 'deleted'],
			temp: {
				id: undefined,
				importance: 1,
				remark: '',
				timestamp: new Date(),
				title: '',
				type: '',
				status: 'published'
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: 'Edit',
				create: 'Create'
			},
			dialogPvVisible: false,
			pvData: [],
			rules: {
				type: [{ required: true, message: 'type is required', trigger: 'change' }],
				timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
				title: [{ required: true, message: 'title is required', trigger: 'blur' }]
			},
			downloadLoading: false
		}
	},
	created() {
		this.getList()
	},
	methods: {
		// 删除
		deleteClick(data) {
			const { id } = data
			this.$Modal.confirm({
				title: '确认要删除该数据吗?',
				onOk: () => {
					deleteArticle({ ids: [id] }).then((res) => {
						if (res.code === 200) {
							this.$message({
								message: '删除成功',
								type: 'success'
							})
							this.getList()
						}
					})
				}
			})
		},
		// 点击预览按钮触发
		editClick(data) {
			const { id, title } = data
			const href = this.skipUrl('edit', id, title)
			window.open(href, '_self')
		},
		// 点击编辑时触发
		preview(data) {
			const { id, title } = data
			const href = this.skipUrl('preview', id, title)
			window.open(href, '_blank')
		},
		skipUrl(key, id, title) {
			const router = {
				preview: '/article/article-preview',
				edit: '/article/article-add'
			}
			const { href } = this.$router.resolve({
				path: router[key],
				query: { id, title }
			})
			return href
		},
		getList() {
			this.list = []
			this.listLoading = true
			const { id, title, content } = this.listQuery
			const obj = {
				orderField: 'title', // 排序字段
				ascending: true, // 是否升序
				pageSize: this.pageConfig.pageSize, // 分页大小
				pageIndex: this.pageConfig.pageIndex, // 当前页码
				data: {
					id,
					title,
					content
				}
			}
			getpagelistReq(obj).then(response => {
				this.list = response.result.data
				this.total = response.result.total
				// Just to simulate the time of the request
				setTimeout(() => {
					this.listLoading = false
				}, 1.5 * 1000)
			})
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		handleModifyStatus(row, status) {
			this.$message({
				message: '操作Success',
				type: 'success'
			})
			row.status = status
		},
		sortChange(data) {
			const { prop, order } = data
			if (prop === 'id') {
				this.sortByID(order)
			}
		},
		sortByID(order) {
			if (order === 'ascending') {
				this.listQuery.sort = '+id'
			} else {
				this.listQuery.sort = '-id'
			}
			this.handleFilter()
		},
		resetTemp() {
			this.temp = {
				id: undefined,
				importance: 1,
				remark: '',
				timestamp: new Date(),
				title: '',
				status: 'published',
				type: ''
			}
		},
		createData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
					this.temp.author = 'vue-element-admin'
					insertArticle(this.temp).then(() => {
						this.list.unshift(this.temp)
						this.dialogFormVisible = false
						this.$notify({
							title: 'Success',
							message: 'Created Successfully',
							type: 'success',
							duration: 2000
						})
					})
				}
			})
		},
		updateData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					const tempData = Object.assign({}, this.temp)
					tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
					modifyArticle(tempData).then(() => {
						const index = this.list.findIndex(v => v.id === this.temp.id)
						this.list.splice(index, 1, this.temp)
						this.dialogFormVisible = false
						this.$notify({
							title: 'Success',
							message: 'Update Successfully',
							type: 'success',
							duration: 2000
						})
					})
				}
			})
		},
		handleDelete(row, index) {
			this.$notify({
				title: 'Success',
				message: 'Delete Successfully',
				type: 'success',
				duration: 2000
			})
			this.list.splice(index, 1)
		},
		formatJson(filterVal) {
			return this.list.map(v => filterVal.map(j => {
				if (j === 'timestamp') {
					return parseTime(v[j])
				} else {
					return v[j]
				}
			}))
		},
		getSortClass: function(key) {
			const sort = this.listQuery.sort
			return sort === `+${key}` ? 'ascending' : 'descending'
		}
	}
}
</script>
