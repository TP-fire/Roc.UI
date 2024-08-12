import Layout from '@/layout'

const permissionRouter = {
	path: '/permission',
	component: Layout,
	redirect: '/permission/user',
	alwaysShow: true, // will always show the root menu
	name: 'Permission',
	meta: {
		title: '权限中心',
		icon: 'lock'
	},
	children: [
		{
			path: 'user',
			component: () => import('@/views/permission/userManage'),
			name: 'user',
			meta: {
				title: '用户管理'
			}
		},
		{
			path: 'role',
			component: () => import('@/views/permission/sysRole'),
			name: 'role',
			meta: {
				title: '角色管理'
			}
		},
		{
			path: 'menu',
			component: () => import('@/views/permission/sysMenuButton'),
			name: 'menu',
			meta: {
				title: '菜单管理'
			}
		},
		{
			path: 'dictManage',
			component: () => import('@/views/permission/dictManage'),
			name: 'dictManage',
			meta: {
				title: '字典信息'
			}
		}
	]
}
export default permissionRouter
