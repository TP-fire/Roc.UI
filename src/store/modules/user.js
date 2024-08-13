import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
	token: getToken(),
	name: '',
	avatar: '',
	introduction: '',
	roles: []
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_INTRODUCTION: (state, introduction) => {
		state.introduction = introduction
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles
	}
}

const actions = {
	// user login
	login({ commit }, userInfo) {
		const { account, password } = userInfo
		return new Promise((resolve, reject) => {
			login({ account: account.trim(), password: password }).then(data => {
				commit('SET_TOKEN', data.access_token)
				setToken(data.access_token)
				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},

	// get user info
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo().then(response => {
				const { result } = response
				console.log(response)
				if (!result) {
					reject('Verification failed, please Login again.')
				}
				const { roleIds, name, headIcon, remark } = result
				const arr = roleIds.split(',')
				// roles must be a non-empty array
				if (!roleIds || roleIds.length <= 0) {
					reject('getInfo: roles must be a non-null array!')
				}

				commit('SET_ROLES', arr)
				commit('SET_NAME', name)
				commit('SET_AVATAR', process.env.VUE_APP_BASE_API + 'user/getheadicon?fileName=' + headIcon)
				commit('SET_INTRODUCTION', remark)
				resolve(result)
			}).catch(error => {
				reject(error)
			})
		})
	},

	// user logout
	logout({ commit, state, dispatch }) {
		return new Promise((resolve, reject) => {
			logout().then(() => {
				commit('SET_TOKEN', '')
				commit('SET_ROLES', [])
				removeToken()
				resetRouter()

				// reset visited views and cached views
				// to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
				dispatch('tagsView/delAllViews', null, { root: true })

				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},

	// remove token
	resetToken({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '')
			commit('SET_ROLES', [])
			removeToken()
			resolve()
		})
	},

	// dynamically modify permissions
	async changeRoles({ commit, dispatch }, role) {
		const token = role + '-token'
		console.log('token' ,token)

		commit('SET_TOKEN', token)
		setToken(token)

		const { roles } = await dispatch('getInfo')

		resetRouter()

		// generate accessible routes map based on roles
		const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
		// dynamically add accessible routes
		router.addRoutes(accessRoutes)

		// reset visited views and cached views
		dispatch('tagsView/delAllViews', null, { root: true })
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
