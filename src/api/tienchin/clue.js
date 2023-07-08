import request from '@/utils/request'

export function listChannels() {
    return request({
        url: '/tienchin/clue/channel',
        method: 'get'
    })
}

export function listActivities(channelId) {
    return request({
        url: '/tienchin/clue/activity/' + channelId,
        method: 'get'
    })
}

export function addClue(data) {
    return request({
        url: "/tienchin/clue",
        method: 'post',
        data: data
    })
}

export function listClue() {
    return request({
        url: "/tienchin/clue/list",
        method: 'get'
    })
}
