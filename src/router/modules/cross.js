/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const crossRouter = {
	path: '/cross',
	component: Layout,
	redirect: '/cross/complex-table',
	name: 'Cross',
	meta: {
		title: 'Cross',
		icon: 'table'
	},
	children: [
		{
			path: 'cross',
			component: () => import('@/views/cross/cross'),
			name: 'StationCross',
			meta: { title: 'StationCross' }
		},
		{
			path: 'machine',
			component: () => import('@/views/cross/cross'),
			name: 'MachineCross',
			meta: { title: 'MachineCross' }
		}
	]
}
export default crossRouter
