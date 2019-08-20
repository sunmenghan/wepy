import wepy from 'wepy'
// import toast from './toast'
// const devUrl = 'http://api-test.duorang.com/operate/'
// const devUrl = 'http://172.16.203.55:8080/operate/'
const devUrl = 'https://app.duorang.com/operate/'

export default class Api extends wepy.mixin {
  /* * api接口封装
  * url: 接口地址 params: 参数 method: 请求方法 flag: 是否携带(token, tokenId) 不传就不带
  */
  url = devUrl;
  request (url, params, flag, method) {
    let that = this
    that.showLoading()
    let header = {
      'Content-type': 'application/json',
      'token': wepy.getStorageSync('token'),
      'tokenid': wepy.getStorageSync('tokenid')
    }
    if (flag) {
      header = {
        'Content-type': 'application/json'
      }
    }
    const pormise = new Promise((resolve, reject) => {
      wepy.request({
        url: devUrl + url + '.json',
        data: params || {},
        method: method || 'GET',
        header: header,
        success: res => {
          console.log('res', res)
          if (res.data.resultCode === 1000) {
            console.log('返回数据', res)
            resolve(res)
          } else if (res.data.resultCode === 1002) {
            // resolve(res)
            console.log(res.data.resultCode)
            that.selfToast(String(res.data.error), 'none', 2000)
            wepy.setStorageSync('token', '')
            wepy.setStorageSync('tokenid', '')
            that.$redirect('../pages/login')
            // that.selfToast(res.error)
          } else {
            that.selfToast(String(res.data.error), 'none', 2000)
            resolve(res)
          }
        },
        fail: err => {
          reject(err)
        },
        complete: res => {
          setTimeout(() => {
            that.hideLoading()
          }, 500)
        }
      })
    })
    return pormise
  }

  // 登录
  loginApi (username, password) {
    const param = {
      'anycode': 'soask_duorang',
      'username': username,
      'password': password
    }
    return this.request('operateuser/loginByPassword', param, true)
  }

  // 扫码签到
  signInApi (usercode) {
    return this.request('activitysign/doadd', {'usercode': usercode})
  }

// 签到列表
  signList (projectId, page) {
    return this.request('activitysign/list', {activity_project_id: projectId, page: page || 1})
  }

  // 获取集采列表
  activityplan (param) {
    return this.request('activityplan/list', param)
  }

  // 根据用户ID和集采ID获取订金单信息
  getSub (userId, projectId) {
    return this.request('soinfo/add', {user_id: userId, activity_project_id: projectId})
  }

  // 提交订金单
  commitSub (userId, receiveId, linkId, projectId) {
    return this.request('soinfo/doadd', {'user_id': userId, 'user_receive_id': receiveId, 'user_link_id': linkId, 'activity_project_id': projectId})
  }

  // 获取订金单
  getSubList (id, page) {
    return this.request('soinfo/list', {activity_project_id: id, 'page': page || 1})
  }

  // 根据手机号获取会员信息
  getMember (tel, id) {
    return this.request('userinfo/getUserByMobile', {mobile: tel, activity_project_id: id})
  }

  // 检查是否支付成功
  checkPay (id) {
    return this.request('soinfo/checkpay', {so_id: id})
  }

  // 查询联系人
  seeContact (id) {
    return this.request('userlink/list', {user_id: id})
  }

  // 编辑联系人
  editContact (param) {
    return this.request('userlink/doupdate', param)
  }

  // 修改默认联系人
  defaultContact (userId, id) {
    return this.request('userlink/updatedefault', {user_id: userId, id: id})
  }

  // 修改默认联系人
  deleteContact (userId, id) {
    return this.request('userlink/del', {user_id: userId, id: id})
  }

  addContact(param) {
    return this.request('userlink/doadd', param)
  }

  // 获取地址列表
  getAddress (data) {
    return this.request('userreceiveinfo/list', data)
  }

  getDataSet(event, key) {
    return event.currentTarget.dataset[key]
  }

  showToasts(title, icon, duration, callBack) {
    wx.showToast({
      title: title || '',
      icon: icon || 'loading',
      duration: duration || 1000,
      success: callBack
    })
  }
// 设为默认地址
  address_update(id) {
    return this.request('userreceiveinfo/updatedefault', id)
  }
// 删除地址
  del_adress(id) {
    return this.request('userreceiveinfo/del', id)
  }
  // 新增地址
  adress_add(para) {
    return this.request('userreceiveinfo/doadd', para)
  }

  validate(value, type) {
    if (type === 'require') {
      return !!value
    }
    if (type === 'phone') {
      return /^1[3456789]\d{9}$/.test(value)
    }
  }
  // 修改地址
  address_modify(data) {
    return this.request('userreceiveinfo/doupdate', data)
  }
  // 扫码收订金
  scanSubscrip(data) {
    return this.request('userinfo/view', data)
  }
  // 报名签到查询
  getSignList(data) {
    return this.request('activityprojectenroll/list', data)
  }

  // 设置备注
  setRemarkData(data) {
    return this.request('activityprojectenroll/returnVisit', data)
  }

  // 获取用户
  getUser(data) {
    return this.request('userinfo/list', data)
  }

  // 获取报名数据
  getEnrollData(data) {
    return this.request('activityprojectenroll/list', data)
  }

  // 获取报名数据
  setReVisitData(data) {
    return this.request('activityprojectenroll/returnVisit', data)
  }

  // 采集活动
  getBaseinfo(data) {
    return this.request('baseinfo/list.json', data)
  }
}
