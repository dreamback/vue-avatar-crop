export const UA = (userAgent => {
  const isOldIos = /OS (\d)_.* like Mac OS X/g.exec(userAgent)
  const isOldAndroid = /Android (\d.*?);/g.exec(userAgent) || /Android\/(\d.*?) /g.exec(userAgent)
  // IOS8.3-
  // android4.5-
  // ios
  // android
  // QQ Browser
  return {
    oldIOS: isOldIos ? +isOldIos.pop() < 8.3 : false,
    oldAndroid: isOldAndroid ? +isOldAndroid.pop().substr(0, 3) < 4.5 : false,
    ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(userAgent),
    android: /Android/g.test(userAgent),
    mQQBrowser: /MQQBrowser/g.test(userAgent)
  }
})(navigator.userAgent)

export function noop () {}
/**
 * Include external script dynamically
 */
export function requireRemoteScript (src, callback) {
  const doc = document
  const head = doc.head || doc.getElementsByTagName('head')[0]

  let node = doc.createElement('script')
  const supportOnload = 'onload' in node
  const onload = function () {
    node = null
    typeof callback === 'function' && callback()
  }

  if (supportOnload) {
    node.onload = onload
  } else {
    node.onreadystatechange = function () {
      if (/loaded|complete/.test(node.readyState)) {
        onload()
      }
    }
  }

  node.async = true
  node.crossOrigin = true
  node.charset = 'utf-8'
  node.src = src
  head.appendChild(node)
}

export function functionToUrl (fn) {
  const blob = new Blob([`(${fn.toString()})(null)`], {type: 'application/javascript'})
  return URL.createObjectURL(blob)
}

export const getClientRect = (el) => el.getBoundingClientRect()
export const getScrollPos = () => {
  return {
    top: document.documentElement.scrollTop || document.body.scrollTop,
    left: document.documentElement.scrollLeft || document.body.scrollLeft
  }
}
export const getElePos = (el) => {
  var scrollPos = getScrollPos()
  var clientRect = getClientRect(el)
  return {
    top: scrollPos.top + clientRect.top,
    left: scrollPos.left + clientRect.left
  }
}
