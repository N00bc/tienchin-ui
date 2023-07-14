import request from '@/utils/request'

// 获取渠道
export function listChannels() {
    return request({
        url: '/tienchin/business/channel',
        method: 'get'
    })
}

// 获取活动
export function listActivities(channelId) {
    return request({
        url: '/tienchin/business/activity/' + channelId,
        method: 'get'
    })
}

// 获取课程信息
export function getCourseByCourseType(type) {
    return request({
        url: '/tienchin/business/course/' + type,
        method: 'get'
    })
}

// 新增线索
export function addBusiness(data) {
    return request({
        url: "/tienchin/business",
        method: 'post',
        data: data
    })
}

// 列出线索列表
export function listBusiness(query) {
    return request({
        url: '/tienchin/business/list',
        method: 'get',
        params: query
    })
}

// 展示部门用户
export function listUserList(deptId) {
    return request({
        url: '/tienchin/business/users/' + deptId,
        method: 'get'
    })
}

// 展示所有用户
export function listOwnerList() {
    return request({
        url: '/tienchin/business/owner',
        method: 'get'
    })
}

// 创建分派线索
export function assignBusiness(data) {
    return request({
        url: '/tienchin/assign',
        method: 'post',
        data: data
    })
}

// 获取BusinessSummary
export function getBusinessSummaryById(businessId) {
    return request({
        url: '/tienchin/business/summary/' + businessId,
        method: 'get'
    })
}

// 更新Business
export function updateBusiness(data) {
    return request({
        url: '/tienchin/business',
        method: 'put',
        data: data
    })
}

// 删除Business
export function deleteBusiness(businessIds) {
    return request({
        url: '/tienchin/business/' + businessIds,
        method: 'delete'
    })
}

// ---------------------------- BusinessDetails ----------------------------
// 根据线索id获取详细线索信息
export function getBusinessDetailsById(businessId) {
    return request({
        url: '/tienchin/business/' + businessId,
        method: 'get'
    })
}

// 跟进商机
export function updateBusinessDetails(data) {
    return request({
        url: '/tienchin/business/follow',
        method: 'put',
        data: data
    })
}

// 查询线索的跟进记录
export function getFollowRecordByBusinessId(businessId) {
    return request({
        url: '/tienchin/follow/record/business/' + businessId,
        method: 'get'
    })
}
