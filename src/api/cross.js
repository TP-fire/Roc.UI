import request from '@/utils/request'

export function createCross(data) {
	return request({
		url: '/Cross/create',
		method: 'post',
		data
	})
}

export function deleteCross(data) {
	return request({
		url: '/mescrossstation/delete',
		method: 'post',
		data
	})
}

export function updateCross(data) {
	return request({
		url: '/mescrossstation/update',
		method: 'post',
		data
	})
}

export function getpagelistReq(data) {
	return request({
		url: '/mescrossstation/getPagelist',
		method: 'post',
		data
	})
}
