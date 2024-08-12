<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.macname" :placeholder="$t('pleaseEnter') + $t('name')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
			<el-table-column :label="$t('account')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.account }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('name')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('phone')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.phone }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('roleId')" min-width="140" align="center">
				<template slot-scope="{row}">
					<span>{{ row.roleIds }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('company')" min-width="160" align="center">
				<template slot-scope="{row}">
					<span>{{ row.companyIds }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('department')" min-width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.departmentIds }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('status')" class-name="status-col" width="100">
				<template slot-scope="{row}">
					<el-tag :type="row.enabled | statusFilter">
						{{ row.enabled }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini" @click="handleUpdate(row)">
						编辑
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="pageConfig.pageIndex" :limit.sync="pageConfig.pageSize" @pagination="getList" />


		<el-dialog :title="Edit" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm" :rules="rules" :model="submitData" label-position="left" label-width="200px" style="width: 600px; margin-left:80px;">
				<el-form-item :label="$t('code')">
					<el-input v-model="submitData.account"/>
				</el-form-item>
				<el-form-item :label="$t('name')" prop="name">
					<el-input v-model="submitData.name" />
				</el-form-item>
				<el-form-item :label="$t('phone')" prop="phone">
					<el-input v-model="submitData.phone"/>
				</el-form-item>
				<el-form-item :label="$t('roleId')">
					<el-checkbox-group v-model="checkList">
						<el-checkbox v-for="item in checkBoxOptions" :key="item.id" :label="item.roleId" > {{item.rolename}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item :label="$t('company')" prop="companyIds">
					<el-input v-model="submitData.companyIds"  />
				</el-form-item>
				<el-form-item :label="$t('department')" prop="departmentIds">
					<el-input v-model="submitData.departmentIds" />
				</el-form-item>
				<el-form-item :label="$t('enabled')" prop="category">
					<el-input v-model="submitData.enabled" type="number" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="printlog()">
				取消
				</el-button>
				<el-button @click="dialogFormVisible = false">
				取消
				</el-button>
				<el-button type="primary" @click="updateData()">
				提交
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
import { getPageList,getEntity,modify} from '@/api/sysUser'
import { getList} from '@/api/sysRole.js'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
			Edit:'编辑',
			tableKey: 0,
			list: [], // 数据
			total: 0,
			listLoading: false,
			checkList:[],
			listQuery: {
				name: ''
			},
			pageConfig: {
				pageSize: 10,
				pageIndex: 1
			},
			sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
			statusOptions: ['published', 'draft', 'deleted'],
			submitData: {},  // 新增修改实体
			checkBoxOptions:[],
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
		printlog(){
			console.log(this.checkList)
			console.log(this.checkBoxOptions)
		},
		getList() {
			this.list = []
			this.listLoading = true
			const { name } = this.listQuery
			const obj = {
				orderField: 'createdate', // 排序字段
				ascending: false, // 是否升序
				pageSize: this.pageConfig.pageSize, // 分页大小
				pageIndex: this.pageConfig.pageIndex, // 当前页码
				data: {
					name
				}
			}
			getPageList(obj).then(response => {
				this.list = response.result.data
				this.total = response.result.total
				// Just to simulate the time of the request
				setTimeout(() => {
					this.listLoading = false
				}, 0.2 * 1000)
			})
		},
		updateData(){
			// success
			// info
			// warning
			// error
			this.submitData.roleIds = this.checkList.join(',');
			const that = this;
			modify(this.submitData).then(res => {
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
		reset() {
			this.submitData = {
				id: undefined,
				importance: 1,
				remark: '',
				timestamp: new Date(),
				title: '',
				status: 'published',
				type: ''
			}
		},
		loadCheckBox(){
			this.checkBoxOptions = []
			const that = this
			getList({}).then((res)=>{
				if(res.code === 200){
					res.result.forEach(item => {
						that.checkBoxOptions.push({
							id:item.id,
							roleName:item.roleName,
							roleId:item.roleId
						})
					})
					that.checkList = that.submitData.roleIds.split(',')
					console.log(that.checkBoxOptions)
					console.log(that.checkList)
				}
			})
		},
		handleUpdate(row) {
			this.submitData = Object.assign({}, row) // copy obj
			this.loadCheckBox();
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			})
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
			getEntity(pv).then(response => {
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
