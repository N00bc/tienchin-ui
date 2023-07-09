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

// 展示部门用户
export function listUserList(deptId) {
    return request({
        url: '/tienchin/clue/users/' + deptId,
        method: 'get'
    })
}

// 创建分派线索
export function assignClue(data) {
    return request({
        url: '/tienchin/assign',
        method: 'post',
        data: data
    })
}

// ---------------------------- ClueDetails ----------------------------
// 根据线索id获取详细线索信息
export function getClueById(clueId) {
    return request({
        url: '/tienchin/clue/' + clueId,
        method: 'get'
    })
}
