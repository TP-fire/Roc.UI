import request from '@/utils/request'


export function getPageList(data) {
  return request({
    url: '/machine/getPageList',
    method: 'post',
    data
  })
}

export function modify(data){
  return request({
    url: '/machine/modify',
    method: 'post',
    data
  })
}

export function upExcel(data){
  return request({
    url: '/machine/upExcel',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/machine/info',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/machine/update',
    method: 'post',
    data
  })
}
