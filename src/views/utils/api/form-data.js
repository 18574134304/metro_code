// 统一请求路径前缀在libs/axios.js中修改
import { postRequest, } from './index';

//上传图片
export const upload = (params) => {
    return postRequest('common/upload', params)
}
//退出登录
export const logout = (params) => {
    return postRequest('user/logout', params)
}

//获取个人信息
export const getUserDetails = (params) => {
    return postRequest('user/getUserDetails', params)
}
// 添加车辆
export const addTrain = (params) => {
    return postRequest('Train/addTrain', params)
}
// 车辆列表 
export const getTrainList = (params) => {
    return postRequest('Train/getTrainList', params)
}
// 辅助驾驶 
export const assistedDriving = (params) => {
    return postRequest('Train_Number/getTrainList', params)
}
// 获取行车日志分类 
export const getDrivingLogCategory = (params) => {
    return postRequest('driving_log/getDrivingLogCategory', params)
}
// 账号列表
export const getListAccount = (params) => {
    return postRequest('Account/getList', params)
}
// 添加账号
export const addAccount = (params) => {
    return postRequest('Account/add', params)
}
// 账号详情
export const getDetailsAccount = (params) => {
    return postRequest('Account/getDetails', params)
}
// 修改账号 
export const editAccount = (params) => {
    return postRequest('Account/edit', params)
}
// 账号(停用/启用)  
export const stopAccount = (params) => {
    return postRequest('Account/stop', params)
}
// 账号删除
export const delAccount = (params) => {
    return postRequest('Account/del', params)
}
// 添加排班
export const trainAdd = (params) => {
    return postRequest('train_schedule/add', params)
}
// 修改排班
export const trainEdit = (params) => {
    return postRequest('train_schedule/edit', params)
}
// 删除排班
export const trainDel = (params) => {
    return postRequest('train_schedule/del', params)
}
// 获取列表 
export const trainGetList = (params) => {
    return postRequest('train_schedule/getList', params)
}
// 获取详情
export const trainGetDetails = (params) => {
    return postRequest('train_schedule/getDetails', params)
}
// 获取司机列表
export const trainGetDriverList = (params) => {
    return postRequest('train_schedule/getDriverList', params)
}
// 获取车列表
export const trainGetTrainList = (params) => {
    return postRequest('train_schedule/getTrainList', params)
}
//获取车次列表
export const getBoutListByTable = (params) => {
    return postRequest('Table_Bout/getBoutListByTable', params)
}

// 添加手册
export const addManual = (params) => {
    return postRequest('manual/addManual', params)
}
// 手册 
export const editManual = (params) => {
    return postRequest('manual/editManual', params)
}
// 删除手册
export const delManual = (params) => {
    return postRequest('Manual/delManual', params)
}
// 获取手册列表
export const getManualList = (params) => {
    return postRequest('Manual/getManualList', params)
}
// 获取手册详情 
export const getManualDetails = (params) => {
    return postRequest('Manual/getManualDetails', params)
}
// 添加分类
export const addCategory = (params) => {
    return postRequest('Manual/addCategory', params)
}
// 获取分类列表
export const getCategoryList = (params) => {
    return postRequest('Manual/getCategoryList', params)
}
// 修改分类
export const editCategory = (params) => {
    return postRequest('Manual/editCategory', params)
}
// 删除分类
export const delCategory = (params) => {
    return postRequest('Manual/delCategory', params)
}


// 添加公告
export const addBulletin = (params) => {
    return postRequest('Bulletin/add', params)
}
// 修改公告
export const editBulletin = (params) => {
    return postRequest('Bulletin/edit', params)
}
// 删除排班 
export const delBulletin = (params) => {
    return postRequest('Bulletin/del', params)
}
// 获取列表
export const getlistBulletin = (params) => {
    return postRequest('Bulletin/getlist', params)
}
// 获取详情
export const getDetailsBulletin = (params) => {
    return postRequest('Bulletin/getDetails', params)
}

// 下发到车辆
export const issuedBulletin = (params) => {
    return postRequest('Bulletin/issued', params)
}
// 获取下发记录
export const getIssuedListBulletin = (params) => {
    return postRequest('Bulletin/getIssuedList', params)
}

// 
// 获取列表
export const rivingGetList = (params) => {
    return postRequest('driving_log/getList', params)
}
// 报修
export const rivingRepair = (params) => {
    return postRequest('driving_log/repair', params)
}
// 获取详情
export const rivingGetDetails = (params) => {
    return postRequest('driving_log/getDetails', params)
}
// 删除 
export const rivingDel = (params) => {
    return postRequest('driving_log/del', params)
}
// 修改  
export const rivingEdit = (params) => {
    return postRequest('driving_log/edit', params)
}



// 获取表的列表
export const getTableListBout = (params) => {
    return postRequest('Table_Bout/getTableList', params)
}
// 获取辅助驾驶列表
export const getTrainListBout = (params) => {
    return postRequest('Table_Bout/getTrainList', params)
}