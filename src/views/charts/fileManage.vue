<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.belongDate" :placeholder="$t('belongDate')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			<el-input v-model="listQuery.alarmType" :placeholder="$t('type')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
			<el-table-column :label="$t('belongDate')" min-width="15%" align="center">
				<template slot-scope="{row}">
					<span>{{ row.belongDate }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('type')" min-width="15%" align="center">
				<template slot-scope="{row}">
					<span>{{ row.alarmType }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('content')" min-width="50%" align="center">
				<template slot-scope="{row}">
					<span>{{ row.alarmContent }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Status" class-name="status-col" min-width="10%">
				<template slot-scope="{row}">
					<el-tag :type="row.enabled | statusFilter">
						{{ row.enabled }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="Actions" align="center" min-width="10%" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button v-if="row.status!='published'" size="mini" type="success" @click="downloadFile(row)">
						download
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
import { getpagelistReq } from '@/api/fileManage'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Axios from 'axios'
import { exportFile } from "@/utils/tools"

export default {
	name: 'File-Manage',
	components: { Pagination },
	directives: { waves },
	filters: {
		statusFilter(status) {
			const statusMap = {
				1: 'exit',
				0: 'delete'
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
				belongDate: '',
				alarmType: ''
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
		downloadFile(row){
			const content = row.alarmContent;
			const fileName = content.split('/').pop();
			var type = { type: "application/vnd.ms-excel"}
			//const httpPath = process.env.VUE_APP_BASE_API+'machine/downloadtemplate/'+ fileName
			Axios.get(content , {
				responseType : 'arraybuffer',
				headers: {"Content-Type" : "application/json;application/octet-stream"},
				timeout: 1000*60*60*60
			})
			.then(res=>{
				let blob = new Blob([res.data],type)
				exportFile(blob,fileName)
			})
		},
		getList() {
			this.list = []
			this.listLoading = true
			const { belongDate,alarmType } = this.listQuery
			const obj = {
				orderField: 'belongdate', // 排序字段
				ascending: false, // 是否升序
				pageSize: this.pageConfig.pageSize, // 分页大小
				pageIndex: this.pageConfig.pageIndex, // 当前页码
				data: {
					belongDate,
					alarmType
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
		handleFetchPv(pv) {
			getentity(pv).then(response => {
				this.pvData = response.data.pvData
				this.dialogPvVisible = true
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
