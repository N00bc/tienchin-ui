import request from '@/utils/request'

/**
 * 根据`course_type`查询课程集合
 * @param type
 * @returns {*}
 */
export function getCourseByCourseType(type) {
    return request({
        url: '/tienchin/contract/course/' + type,
        method: 'get'
    })
}

export function removeContractFile(fullPath) {
    return request({
        url: '/tienchin/contract/remove_contract',
        method: 'delete',
        data: fullPath
    })
}

export function addContract(data) {
    return request({
        url: '/tienchin/contract',
        method: 'post',
        data: data
    })
}

export function updateContract(data) {
    return request({
        url: '/tienchin/contract',
        method: 'put',
        data: data
    })
}
// 展示部门用户
export function listUserList(deptId) {
    return request({
        url: '/tienchin/contract/users/' + deptId,
        method: 'get'
    })
}

// 顶部搜索栏:展示所有用户
export function listOwnerList() {
    return request({
        url: '/tienchin/contract/owner',
        method: 'get'
    })
}
