import request from '@/utils/request'

// 查询渠道列表
export function listChannel(query) {
    return request({
        url: '/tienchin/channel/list',
        method: 'get',
        params: query
    })
}

// 查询渠道详细
export function getChannel(roleId) {
    return request({
        url: '/tienchin/channel/' + roleId,
        method: 'get'
    })
}

// 新增渠道
export function addChannel(data) {
    return request({
        url: '/tienchin/channel',
        method: 'post',
        data: data
    })
}

// 修改渠道
export function updateChannel(data) {
    return request({
        url: '/tienchin/channel',
        method: 'put',
        data: data
    })
}



// 删除角色
export function deleteChannel(channel) {
    return request({
        url: '/tienchin/channel/' + channel,
        method: 'delete'
    })
}

