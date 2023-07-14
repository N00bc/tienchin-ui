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
export function listClue(query) {
    return request({
        url: '/tienchin/clue/list',
        method: 'get',
        params: query
    })
}

// 展示部门用户
export function listUserList(deptId) {
    return request({
        url: '/tienchin/clue/users/' + deptId,
        method: 'get'
    })
}

// 展示所有用户
export function listOwnerList() {
    return request({
        url: '/tienchin/clue/owner',
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

// 获取ClueSummary
export function getClueSummaryById(clueId) {
    return request({
        url: '/tienchin/clue/summary/' + clueId,
        method: 'get'
    })
}

// 更新Clue
export function updateClue(data) {
    return request({
        url: '/tienchin/clue',
        method: 'put',
        data: data
    })
}

// 删除Clue
export function deleteClue(clueIds) {
    return request({
        url: '/tienchin/clue/' + clueIds,
        method: 'delete'
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

// 更新线索信息
export function updateClueDetails(data) {
    return request({
        url: '/tienchin/clue/follow',
        method: 'put',
        data: data
    })
}

// 查询线索的跟进记录
export function getFollowRecordByClueId(clueId) {
    return request({
        url: '/tienchin/follow/record/clue/' + clueId,
        method: 'get'
    })
}

//
export function invalidClue(data) {
    return request({
        url: '/tienchin/clue/invalidate',
        method: 'put',
        data: data
    })
}

// ---------------------------- Business ----------------------------
export function clue2business(clueId) {
    return request({
        url: '/tienchin/clue/business/' + clueId,
        method: 'put'
    })
}
