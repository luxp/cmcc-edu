let cheerio = require('cheerio')
var fetch = require('node-fetch')
var fs = require('fs')
var co = require('co')
var userInfo = require('./user.json')

function * fetchHtml (url, option) {
  option.credentials = 'include'
  const res = yield fetch(url, option)
  return res.text()
}
function getValues ($, keys) {
  let data = {}
  for (let key of keys) {
    data[key] = $('#' + key).val()
  }
  return data
}

function getFormString (data) {
  return Object.keys(data).reduce((str, key) => {
    str += key + '=' + encodeURIComponent(data[key]) + '&'
    return str
  }, '')
}
function * signIn () {
  let $ = cheerio.load(yield fetchHtml('http://www.baidu.com', { credentials: 'include' }))
  const userName = process.argv[2] || userInfo.userName
  const userPwd = process.argv[3] || userInfo.userPwd
  $('#userName').val(userName)
  $('#userPwd').val(userPwd)
  const formData = getValues($, [
    'wlanAcName',
    'wlanAcIp',
    'wlanUserIp',
    'ssid',
    'userName',
    'userPwd'
  ])
  const formString = getFormString(formData)
  const { action } = $('#Wlan_Login').attr()
  const result = yield fetchHtml(action, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    body: formString
  })
  const remoteHost = result.match(/action="(.*)\/zmcc\/portalLoginRedirect\.wlan"/)[1]
  fs.writeFileSync('./wlan.json', JSON.stringify({
    formString,
    remoteHost
  }))
  fs.writeFileSync('./user.json', JSON.stringify({
    userName,
    userPwd
  }))
  console.log('login success')
}
co(function * () {
  yield signIn()
})
