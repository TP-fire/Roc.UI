import Layout from '@/layout'

const articleRouter = {
	path: '/article',
	component: Layout,
	redirect: '/article/article-manage',
	alwaysShow: true, // will always show the root menu
	name: 'Article',
	meta: {
		title: '文章中心',
		icon: 'list',
		roles: ['admin', 'editor'] // you can set roles in root nav
	},
	children: [
		{
			path: 'article-add',
			component: () => import('@/views/article/article-add'),
			name: 'article-add',
			meta: {
				title: 'article-add',
				roles: ['admin'] // or you can only set roles in sub nav
			}
		},
		{
			path: 'article-manage',
			component: () => import('@/views/article/article-manage'),
			name: 'article-manage',
			meta: {
				title: 'article-manage',
				roles: ['admin'] // or you can only set roles in sub nav
			}
		}
	]
}

export default articleRouter
