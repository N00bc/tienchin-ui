import request from '@/utils/request'

// 获取渠道
export function listChannels() {
    return request({
        url: '/tienchin/clue/channel',
        method: 'get'
    })
}

// 获取活动
export function listActivities(channelId) {
    return request({
        url: '/tienchin/clue/activity/' + channelId,
        method: 'get'
    })
}

// 新增线索
export function addClue(data) {
    return request({
        url: "/tienchin/clue",
        method: 'post',
        data: data
    })
}

// 列出线索列表
export function listClue() {
    return request({
        url: "/tienchin/clue/list",
        method: 'get'
    })
}

//
export function listUserList(deptId) {
    return request({
        url: '/tienchin/clue/users/' + deptId,
        method: 'get'
    })
}
