<template>
	<el-table :data="list" style="width: 100%;padding-top: 15px;">
		<el-table-column label="employeecard" width="200" align="center">
			<template slot-scope="{row}">
				{{ row.employeecard }}
			</template>
		</el-table-column>
		<el-table-column label="name" width="200" align="center">
			<template slot-scope="scope">
				{{ scope.row.name }}
			</template>
		</el-table-column>
		<el-table-column label="machine_code" min-width="200">
			<template slot-scope="scope">
				{{ scope.row.machinecode }}
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
import { getpagelistReq } from '@/api/cross'

export default {
	filters: {
		orderNoFilter(str) {
			return str.substring(0, 30)
		}
	},
	data() {
		return {
			list: null
		}
	},
	created() {
		// this.fetchData()
	},
	methods: {
		fetchData() {
			const obj = {
				orderField: 'id',
				ascending: false,
				pageIndex: 1,
				pageSize: 30,
				data: {}
			}
			getpagelistReq(obj).then(response => {
				this.list = response.result.data.slice(0, 8)
			})
		}
	}
}
</script>
