var fetch = require('node-fetch')
const data = require('./wlan.json')
fetch(data.remoteHost + '/zmcc/portalLogout.wlan', {
  method: 'POST',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: data.formString
}).then((res) => {
  res.text()
}).then((text) => {
  console.log('logout success')
})