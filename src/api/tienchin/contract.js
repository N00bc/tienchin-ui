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

// 根据客户手机号查找客户姓名
export function getCustomerNameByPhoneNumber(phoneNumber) {
    return request({
        url: '/tienchin/contract/customer/' + phoneNumber,
        method: 'get'
    })
}

// 查询当前用户待审批
export function getUnapproveTask() {
    return request({
        url: '/tienchin/contract/unapprove',
        method: 'get'
    })
}

// 查看选中列详细信息
export function getContractById(contractId) {
    return request({
        url: '/tienchin/contract/view/' + contractId,
        method: 'get'
    })
}

// 预览pdf
export function getContractPdf(filePath) {
    return request({
        url: '/tienchin/contract/pdf/' + filePath,
        method: 'get'
    })
}

// 获取提交但未审批的任务
export function getCommittedTask() {
    return request({
        url: '/tienchin/contract/committedTask',
        method: 'get'
    })
}

// 审批任务
export function approveOrReject(data) {
    return request({
        url: '/tienchin/contract/approve',
        data: data,
        method: 'post'
    })
}
