<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				Search
			</el-button>
			<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
				Export
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
					<span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
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
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleUpdate(row)">
						Edit
					</el-button>
					<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
						Publish
					</el-button>
					<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
						Delete
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="pageConfig.pageIndex" :limit.sync="pageConfig.pageSize" @pagination="getList" />

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
import { getpagelistReq, getentity, insertArticle, modifyArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
	name: 'Cross',
	components: { Pagination },
	directives: { waves },
	filters: {
		statusFilter(status) {
			const statusMap = {
				1: 'success',
				0: 'danger'
			}
			return statusMap[status]
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
		// handleCreate() {
		// 	this.resetTemp()
		// 	this.dialogStatus = 'create'
		// 	this.dialogFormVisible = true
		// 	this.$nextTick(() => {
		// 		this.$refs['dataForm'].clearValidate()
		// 	})
		// },
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
		handleUpdate(row) {
			this.temp = Object.assign({}, row) // copy obj
			this.temp.timestamp = new Date(this.temp.timestamp)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
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
		handleFetchPv(pv) {
			getentity(pv).then(response => {
				this.pvData = response.data.pvData
				this.dialogPvVisible = true
			})
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
				const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
				const data = this.formatJson(filterVal)
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: 'table-list'
				})
				this.downloadLoading = false
			})
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
