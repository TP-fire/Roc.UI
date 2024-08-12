<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleNodeInsert">
				新增节点
			</el-button>
			<div class="fr">
				<el-input v-model="listQuery.title" :placeholder="$t('pleaseEnter') + $t('name')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			
				<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
					查询
				</el-button>
				<el-button v-waves class="filter-item" style="margin-left: auto;" type="primary" icon="el-icon-plus" @click="handleInsert">
					插入
				</el-button>
				<el-button v-waves class="filter-item" style="margin-left: auto;" type="primary" icon="el-icon-edit" @click="handleModify">
					修改
				</el-button>
			</div>
		</div>
		<el-container>
			<el-aside style="padding: 1px;" width="15%">
				<el-input
				placeholder="输入关键字进行过滤"
				v-model="filterText">
				</el-input>

				<el-tree
				class="filter-tree"
				:data="treeData"
				:props="defaultProps"
				default-expand-all
				:filter-node-method="filterNode"
				@node-click="handleNodeClick"
				ref="tree">
				</el-tree>
			</el-aside>
			<el-main style="padding: 1px 10px;color:white">
				<el-table
					:key="tableKey"
					v-loading="listLoading"
					:data="list"
					border
					@current-change="handleCurrentChange"
					fit
					highlight-current-row
					style="width: 100%;"
				>
					<el-table-column :label="$t('sortCode')" min-width="140" align="center">
						<template slot-scope="{row}">
							<span>{{ row.sortCode }}</span>
						</template>
					</el-table-column>
					<el-table-column :label="$t('detailCode')" min-width="140" align="center">
						<template slot-scope="{row}">
							<span>{{ row.detailCode }}</span>
						</template>
					</el-table-column>
					<el-table-column :label="$t('detailName')" min-width="140" align="center">
						<template slot-scope="{row}">
							<span>{{ row.detailName }}</span>
						</template>
					</el-table-column>
					<el-table-column :label="$t('remark')" min-width="140" align="center">
						<template slot-scope="{row}">
							<span>{{ row.remark }}</span>
						</template>
					</el-table-column>
					
					<el-table-column :label="$t('status')" class-name="status-col" width="100">
						<template slot-scope="{row}">
							<el-tag :type="row.enabled | statusFilter">
								{{ row.enabled }}
							</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
		</el-container>
		

		<pagination v-show="total>0" :total="total" :page.sync="pageConfig.pageIndex" :limit.sync="pageConfig.pageSize" @pagination="getDetailList" />


			<el-dialog :title="dialogNodeTitle" :visible.sync="dialogNodeVisible">
			<el-form ref="nodeForm" :rules="rules" :model="node" label-position="left" label-width="200px" style="width: 600px; margin-left:80px;">
				<el-form-item label="父节点" prop="parentId" >
					<el-select v-model="node.parentId"  placeholder="please select" >
						<el-option v-for="item in parentNode" :key="item.key" :label="item.name" :value="item.key"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('itemCode')"  prop="itemCode">
					<el-input v-model="node.itemCode"  />
				</el-form-item>
				<el-form-item :label="$t('itemName')" prop="itemName">
					<el-input v-model="node.itemName"  />
				</el-form-item>
				<el-form-item :label="$t('sortCode')" prop="sortCode">
					<el-input v-model="node.sortCode" type="number" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogNodeVisible = false">
				Cancel
				</el-button>
				<el-button type="primary" @click="nodeInsert()">
				Confirm
				</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm" :rules="rules" :model="detail" label-position="left" label-width="200px" style="width: 600px; margin-left:80px;">
				<el-form-item :label="$t('itemId')" prop="itemId">
					<el-input v-model="detail.itemId" />
				</el-form-item>
				<el-form-item :label="$t('detailCode')" prop="detailCode">
					<el-input v-model="detail.detailCode"  />
				</el-form-item>
				<el-form-item :label="$t('detailName')" prop="detailName">
					<el-input v-model="detail.detailName"  />
				</el-form-item>
				<el-form-item :label="$t('remark')" prop="remark">
					<el-input v-model="detail.remark"  />
				</el-form-item>
				<el-form-item :label="$t('sortCode')" prop="sortCode">
					<el-input v-model="detail.sortCode" type="number" />
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

	</div>
</template>

<script>
import { getTreeData,getPagelist,insertDict,insertDictDetail,modifyDictDetail} from '@/api/dictManage'
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
			defaultProps: {
				children: 'children',
				label: 'title'
			},
			filterText: '',
			treeData:[{
				id: 1,
				title: '一级 1',
				children: [{
					id: 4,
					label: '二级 1-1',
					children: [
						{
							id: 9,
							label: '三级 1-1-1'
						}, 
						{
							id: 10,
							label: '三级 1-1-2'
						}
					]
				}]
			}],
			parentNode:[{key:'0',name:'根节点'},{key:'0',name:'根节点'}],
			tableKey: 0,
			list: [], // 数据
			total: 0,
			listLoading: false,
			listQuery: {
				orderField:'createDate',
				ascending:false,
				itemId: ''
			},
			pageConfig: {
				pageSize: 10,
				pageIndex: 1
			},
			dialogTitle:'新增',
			isAdd: true,
			dialogNodeTitle:'新增节点',
			sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
			statusOptions: ['published', 'draft', 'deleted'],
			detail: {
				id: undefined,
				itemId: '',
				detailCode: '',
				detailName: '',
				remark: '',
				sortCode: 0
			},
			node: {
				parentId: '0',
				itemCode: '',
				itemName: '',
				sortCode: 0
			},

			dialogFormVisible: false,
			dialogNodeVisible: false,
			rules: {
				type: [{ required: true, message: 'type is required', trigger: 'change' }],
				timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
				title: [{ required: true, message: 'title is required', trigger: 'blur' }]
			},
			downloadLoading: false
		}
	},
	watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
	created() {
		this.getTree();
		// this.getDetailList()
	},
	methods: {
		handleInsert(){
			this.dialogTitle = '新增'
			this.isAdd=true
			this.dialogFormVisible = true
			this.reset()
			console.log('新增按钮',this.detail)
			this.detail.itemId = this.parentNode[1].name
		},
		handleModify(){
			this.dialogTitle = '修改'
			this.isAdd = false
			this.dialogFormVisible = true
			console.log('修改按钮',this.detail)
			this.detail.itemId = this.parentNode[1].name
		},
		updateData(){
			// success
			// info
			// warning
			// error
			const that = this;
			console.log('点击更新',this.detail)
			this.detail.itemId = this.parentNode[1].key
			console.log(this.node)
			const message = this.isAdd?'insert Successfully':'update Successfully'
			let request = that.isAdd ? insertDictDetail(this.detail) : modifyDictDetail(this.detail);
			request.then(res => {
				if(res.code == 200){
					that.$notify({
							title: 'Success',
							message: message,
							type: 'success',
							duration: 2000
						})
					that.getDetailList();
				}else{
					that.$notify({
							title: 'Fail',
							message: 'execute fail',
							type: 'fail',
							duration: 4000
						})
					that.getDetailList();
				}
			})
			this.dialogFormVisible = false
		},
		handleNodeInsert(){
			this.dialogNodeVisible = true
		},
		nodeInsert(){
			const that = this;
			insertDict(that.node).then(res => {
				if(res.code == 200){
					that.$notify({
							title: 'Success',
							message: 'update Successfully',
							type: 'success',
							duration: 2000
						})
					that.getTree();
				}else{
					that.$notify({
							title: 'Fail',
							message: 'update fail',
							type: 'fail',
							duration: 4000
						})
					that.getTree();
				}
			})
			this.dialogNodeVisible = false
		},
		filterNode(value, data) {
			console.log(data)
			if (!value) return true;
			return data.title.indexOf(value) !== -1;
		},
		getTree(){
			this.treeData = []
			getTreeData().then(response =>{
				this.treeData = response.result
			})
		},
		handleNodeClick(data){
			console.log('节点点击',this.listQuery)
			this.listQuery.itemId = data.id
			this.parentNode[1] = {key:data.id,name:data.title}
			this.node.parentId = data.id
			this.getDetailList()
		},
		handleCurrentChange(val){
			if(val)
				this.detail = val
		},
		getDetailList() {
			const that  = this
			that.list = []
			that.listLoading = true
			console.log('获取明细',this.listQuery)
			const { itemId,orderField,ascending } = that.listQuery
			const obj = {
				orderField: orderField, // 排序字段
				ascending: ascending, // 是否升序
				pageSize: that.pageConfig.pageSize, // 分页大小
				pageIndex: that.pageConfig.pageIndex, // 当前页码
				data: {
					itemId
				}
			}
			getPagelist(obj).then(response => {
				that.list = response.result.data
				that.total = response.result.total
				// Just to simulate the time of the request
				setTimeout(() => {
					that.listLoading = false
				}, 0.3 * 1000)
			})
		},
		handleFilter() {
			this.pageConfig.pageIndex = 1
			this.getDetailList()
		},
		reset() {
			
			console.log('重置detail',this.detail)
			this.detail = {
				id: undefined,
				itemId: '',
				detailCode: '',
				detailName: '',
				remark: '',
				sortCode: 0
			}
		},
		handleUpdate(row) {
			this.temp = Object.assign({}, row) // copy obj
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
