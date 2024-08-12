/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const configRouter = {
	path: '/config',
	component: Layout,
	redirect: '/config/user-config',
	name: 'Config',
	meta: {
		title: '配置中心',
		icon: 'form'
	},
	children: [
		{
			path: 'user-config',
			component: () => import('@/views/config/user-config'),
			name: 'UserConfig',
			meta: { title: '员工上线' }
		},
		{
			path: 'machine-config',
			component: () => import('@/views/config/machine-config'),
			name: 'MachineConfig',
			meta: { title: '设备信息' }
		}
	]
}

export default configRouter
