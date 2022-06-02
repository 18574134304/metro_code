import axios from 'axios'
const url = 'https://dt.waibaoke.cn/api/'


// 登录
export const loginGo = (url, data) => {
    return axios.post(url, data)
}

// 频道
export const getChannel = (url, data) => {
    return axios.post(url, data)
}
// post 请求
export const postRequest = (url, params) => {
    let user = JSON.parse(localStorage.getItem("user"))
    let accessToken = user.token
    return axios({
        method: 'post',
        url: url,
        data: params,
        headers: {
            "content-type": "multipart/form-data",
            'token': accessToken
        }
    });
};
// 开始录制
export const startRecording = (url,data) => {
        return axios.post(url,data)
    }
    
    // 结束录制
    export const endRecording = (url,data) => {
        return axios.post(url,data)
    }