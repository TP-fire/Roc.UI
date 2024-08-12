<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.macname" :placeholder="$t('pleaseEnter') + $t('name')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				Search
			</el-button>
			<el-button v-waves class="filter-item" type="primary"  @click="downloadExcelTemplate">
				<svg-icon icon-class="excel"/>
				template
			</el-button>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-upload"  @click="handleUpload">
				upload
			</el-button>
			<input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick" style="display: none;" />
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
			<el-table-column :label="$t('code')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('sheetName')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.sheetName }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('projectCode')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.projectCode }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('customer')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.customer }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('name')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.macName }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('stockCode')" min-width="160" align="center">
				<template slot-scope="{row}">
					<span>{{ row.stockCode }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('typeCode')" min-width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.typeCode }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('typeid')" min-width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.typeId }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('workhours')" width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.workhours }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('moreworkhours')" width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.moreWorkhours }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('outdate')" width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.outdate }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('outNum')" width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.outNum }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('arrivaldate')" width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.arrivaldate }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('remark')" min-width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.remark }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini" @click="handleUpdate(row)">
						编辑
					</el-button>
					<el-button type="primary" size="mini" @click="handleArrive(row)">
						到货
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="pageConfig.pageIndex" :limit.sync="pageConfig.pageSize" @pagination="getList" />


		<el-dialog :title="Edit" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px" style="width: 600px; margin-left:80px;">
				<el-form-item label="code" prop="id">
					<el-input v-model="temp.id" disabled = "false"/>
				</el-form-item>
				<el-form-item label="projectCode" prop="projectCode">
					<el-input v-model="temp.projectCode" disabled = "false"/>
				</el-form-item>
				<el-form-item label="customer" prop="customer">
					<el-input v-model="temp.customer"  disabled = "false"/>
				</el-form-item>
				<el-form-item label="name" prop="macName">
					<el-input v-model="temp.macName"  disabled = "false"/>
				</el-form-item>
				<el-form-item label="outNum" prop="outNum">
					<el-input v-model="temp.outNum"  disabled = "false"/>
				</el-form-item>
				<el-form-item label="type" prop="typeId">
					<el-select
						v-model="temp.typeId"
						placeholder="please select"
						@change="typeChange"
						>
						<el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.name" />
					</el-select>
				</el-form-item>
				<el-form-item label="workhours" prop="workhours">
					<el-input v-model="temp.workhours" type="number" />
				</el-form-item>
				<el-form-item label="workhours" prop="moreWorkhours">
					<el-input v-model="temp.moreWorkhours" type="number" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
				Cancel
				</el-button>
				<el-button type="primary" @click="updateData()">
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
import { getPageList,getInfo,modify,upExcel} from '@/api/machine'
import { exportFile } from "@/utils/tools"
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Axios from 'axios'

export default {
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
			options:[
				{
					name:'标准机型',
					id:'standard-single'
				},
				{
					name:'非标单机型',
					id:'non-standard-single'
				},
				{
					name:'设备改装/工装',
					id:'standard-line'
				},
				{
					name:'非标线体',
					id:'non-standard-line'
				}
			],
			tableKey: 0,
			list: [], // 数据
			total: 0,
			listLoading: false,
			listQuery: {
				macname: ''
			},
			pageConfig: {
				pageSize: 10,
				pageIndex: 1
			},
			sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
			statusOptions: ['published', 'draft', 'deleted'],
			temp: {
				id: undefined,
				macName: '',
				address: '',
				typeId: '',
				arrivaldate: '',
				workhours: '',
				moreWorkhours: ''
			},

			dialogFormVisible: false,
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
		typeChange(val) {
			switch(val){
				case 'non-standard-line':
					this.temp.workhours = 21600 * this.temp.outNum
					break
				case 'non-standard-single':
					this.temp.workhours = 18900 * this.temp.outNum
					break
				case 'standard-line':
					this.temp.workhours = 18900 * this.temp.outNum
					break
				case 'standard-single':
					this.temp.workhours = 11800 * this.temp.outNum
					break
				default:
					this.temp.workhours = 11800
			}
		},
		getList() {
			this.list = []
			this.listLoading = true
			const { macname } = this.listQuery
			const obj = {
				orderField: 'arrivaldate', // 排序字段
				ascending: true, // 是否升序
				pageSize: this.pageConfig.pageSize, // 分页大小
				pageIndex: this.pageConfig.pageIndex, // 当前页码
				data: {
					macname
				}
			}
			getPageList(obj).then(response => {
				this.list = response.result.data
				this.total = response.result.total
				// Just to simulate the time of the request
				setTimeout(() => {
					this.listLoading = false
				}, 1.5 * 1000)
			})
		},
		downloadExcelTemplate(){
			var fileName = 'template.xlsx'
			var type = { type: "application/vnd.ms-excel"}
			const httpPath = process.env.VUE_APP_BASE_API+'machine/downloadtemplate/'+ fileName
			Axios.get(httpPath , {
				responseType : 'arraybuffer',
				headers: {"Content-Type" : "application/json;application/octet-stream"},
				timeout: 1000*60*60*60
			})
			.then(res=>{
				let blob = new Blob([res.data],type)
				exportFile(blob,fileName)
			})
		},
		updateData(){
			// success
			// info
			// warning
			// error
			const that = this;
			modify(this.temp).then(res => {
				if(res.code == 200){
					that.$notify({
							title: 'Success',
							message: 'update Successfully',
							type: 'success',
							duration: 2000
						})
					that.getList();
				}else{
					that.$notify({
							title: 'Fail',
							message: 'update fail',
							type: 'fail',
							duration: 4000
						})
					that.getList();
				}
			})
			this.dialogFormVisible = false
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		handleUpload() {
			this.$refs['excel-upload-input'].click()
		},
		handleClick(e) {
			const files = e.target.files
			const rawFile = files[0] // only use files[0]
			if (!rawFile) 
				return
			this.upload(rawFile)
		},
		upload(rawFile) {
			this.$refs['excel-upload-input'].value = null // fix can't select the same excel
			let formData = new FormData()
			formData.append('file',rawFile)
			const that = this;
			// 此处调用接口上传
			upExcel(formData).then(res=>{
				if(res.code == 200){
					that.$notify({
							title: 'Success',
							message: 'upload Successfully',
							type: 'success',
							duration: 2000
						})
					that.getList();
				}else{
					that.$notify({
							title: 'Fail',
							message: 'upload fail',
							type: 'fail',
							duration: 4000
						})
					that.getList();
				}
			})

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
		handleUpdate(row) {
			this.temp = Object.assign({}, row) // copy obj
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			})
		},
		handleArrive(row) {
			const that = this
			if(row.arrivaldate){
				that.$message({
					type: 'info',
					message: '无需操作'
				})
				return
			}
			that.$confirm('是否确认到货?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				row.arrivaldate = that.dateFormat();
				this.temp = Object.assign({}, row) // copy obj
				that.updateData()
				that.$message({
					type: 'success',
					message: '确认到货成功!'
			});
			}).catch(() => {
				that.$message({
					type: 'info',
					message: '已取消'
				});          
			});
		},
		dateFormat() {
			var date=new Date();
			var year=date.getFullYear();
			/* 在日期格式中，月份是从0开始的，因此要加0
				* 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				* */
			var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
			var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
			var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
			var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
			var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
			// 拼接
			return year+"-"+month+"-"+day+"T"+hours+":"+minutes+":"+seconds;
		},
		handleFetchPv(pv) {
			getInfo(pv).then(response => {
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
