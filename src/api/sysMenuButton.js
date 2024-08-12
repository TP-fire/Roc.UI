import request from '@/utils/request'

/// <summary>
/// 描述： This is the class description
/// 作者：TP
/// 创建日期：2024/6/11 13:23:09
/// 版本：1.5
/// </summary>

export function insertEntity(data){
	return request({
	  url: '/sysmenubutton/insert',
	  method: 'post',
	  data
	})
}

export function deleteEntity(data){
	return request({
	  url: '/sysmenubutton/delete',
	  method: 'post',
	  data
	})
}

export function modifyEntity(data){
	return request({
	  url: '/sysmenubutton/modify',
	  method: 'post',
	  data
	})
}

export function getPageList(data) {
  return request({
    url: '/sysmenubutton/getPageList',
    method: 'post',
    data
  })
}

export function getMenuTree() {
  return request({
    url: '/sysmenubutton/getmenutree',
    method: 'get'
  })
}
