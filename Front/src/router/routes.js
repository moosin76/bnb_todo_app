const routes = [
	{
		path: '/',
		component: () => import('layouts/BlankLayout.vue'),
		children: [
      { name: 'help', path: '', component: () => import('pages/HelpPage.vue') },
    ]
	},
	{
		path: '/memeber',
		component: () => import('layouts/MainLayout.vue'),
		meta: {
			access: 'member'
		},
		children: [
			{ name: 'todo', path: 'todo', component: () => import('pages/TodoPage.vue') },
			{ name: 'chat', path: 'chat', component: () => import('pages/ChatPage.vue') },
      { name: 'news', path: 'news', component: () => import('pages/NewsPage.vue') },
		]
	},
	{
		path: '/user',
		component: () => import('layouts/BlankLayout.vue'),
		children: [
			{ name: 'join', path: 'join', component: () => import('pages/user/JoinPage.vue') },
			{ name: 'login', path: 'login', component: () => import('pages/user/LoginPage.vue') }
		]
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue')
	}
]

export default routes
