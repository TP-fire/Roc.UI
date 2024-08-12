import request from '@/utils/request'

/// <summary>
/// 描述： This is the class description
/// 作者：TP
/// 创建日期：2024/6/11 14:17:08
/// 版本：1.6
/// </summary>

export function insertEntity(data){
	return request({
	  url: '/sysrole/insert',
	  method: 'post',
	  data
	})
}

export function deleteEntity(data){
	return request({
	  url: '/sysrole/delete',
	  method: 'post',
	  data
	})
}

export function modifyEntity(data){
	return request({
	  url: '/sysrole/modify',
	  method: 'post',
	  data
	})
}

export function getPageList(data) {
  return request({
    url: '/sysrole/getPageList',
    method: 'post',
    data
  })
}

export function getList(data) {
	return request({
	  url: '/sysrole/getList',
	  method: 'post',
	  data
	})
  }
