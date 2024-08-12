import request from '@/utils/request'
  
  // 查询
  export const getTreeData = () => {
    return request({
        timeout: 0,
        url: '/dataitemdetail/getDataDictTree',
        method: 'get'
    })
  }
  // 查询
  export function getPagelist(data){
    return request({
        timeout: 0,
        url: '/dataitemdetail/getPagelist',
        method: 'post',
        data
    })
  }
  // 插入
  export const insertDictDetail = data => {
    return request({
        timeout: 0,
        url: '/dataitemdetail/insert',
        method: 'post',
        data
    })
  }
  // 删除
  export const deleteDictDetail = data => {
    return request({
        timeout: 0,
        url: '/dataitemdetail/delete',
        method: 'post',
        data
    })
  }
  // 修改
  export const modifyDictDetail = data => {
    return request({
        timeout: 0,
        url: '/dataitemdetail/modify',
        method: 'post',
        data
    })
  }

  
  // 插入
  export const insertDict = data => {
    return request({
        timeout: 0,
        url: '/dataitemdetail/insertTree',
        method: 'post',
        data
    })
  }
  
  // 修改
  export const modifyDict = data => {
    return request({
        timeout: 0,
        url: '/dataitemdetail/modifyTree',
        method: 'post',
        data
    })
  }