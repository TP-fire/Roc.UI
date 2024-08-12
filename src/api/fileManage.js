import request from '@/utils/request'


export function getpagelistReq(data) {
	return request({
		url: '/filemanage/getPagelist',
		method: 'post',
		data
	})
}
