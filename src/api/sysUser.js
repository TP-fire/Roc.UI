import request from '@/utils/request'


export function getPageList(data) {
  return request({
    url: '/sysuser/getPageList',
    method: 'post',
    data
  })
}

export function modify(data){
  return request({
    url: '/sysuser/modify',
    method: 'post',
    data
  })
}

export function getEntity(data) {
  return request({
    url: '/sysuser/getEntity',
    method: 'post',
    data
  })
}
