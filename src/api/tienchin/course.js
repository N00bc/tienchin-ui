import request from '@/utils/request'

// 查询活动列表
export function listCourse(query) {
    return request({
        url: '/tienchin/course/list',
        method: 'get',
        params: query
    })
}

// 修改课程
export function updateCourse(data) {
    return request({
        url: '/tienchin/course',
        method: 'put',
        data: data
    })
}

// 新增课程
export function addCourse(data) {
    return request({
        url: '/tienchin/course',
        method: 'post',
        data: data
    })
}

// 根据课程id获取课程信息
export function getCourse(courseId) {
    return request({
        url: '/tienchin/course/' + courseId,
        method: 'get'
    })
}

export function deleteCourse(courseId) {
    return request({
        url: '/tienchin/course/' + courseId,
        method: 'delete'
    })
}

