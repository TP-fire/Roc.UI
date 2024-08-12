import request from '@/utils/request'

export function getList(data) {
	return request({
		url: '/biarticle/getList',
		method: 'post',
		data
	})
}

export function getentity(data) {
	return request({
		url: '/biarticle/getentity',
		method: 'post',
		data
	})
}

export function insertArticle(data) {
	return request({
		url: '/biarticle/insert',
		method: 'post',
		data
	})
}

export function deleteArticle(data) {
	return request({
		url: '/biarticle/delete',
		method: 'post',
		data
	})
}

export function modifyArticle(data) {
	return request({
		url: '/biarticle/modify',
		method: 'post',
		data
	})
}

export function getpagelistReq(data) {
	return request({
		url: '/biarticle/getPagelist',
		method: 'post',
		data
	})
}
