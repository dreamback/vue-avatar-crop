<template>
  <img style="position:absolute" image-dragble :src="src">
</template>
<script>
import {getElePos, UA} from './util'
const $html = document.querySelector('html')
const $body = document.querySelector('body')
export default {
  name: 'image-picker',
  props: {
    src: String,
    maxTop: null,
    maxLeft: null,
    width: Number,
    height: Number,
    avatarWidth: Number,
    avatarHeight: Number
  },
  data () {
    return {
      drag: false,
      touchType: 1, // 1: drag action, 2: zoom action
      startPos: {
        touchX: 0,
        touchY: 0,
        top: 0,
        left: 0,
        w: 0,
        h: 0
      },
      startZoom: 0
    }
  },
  methods: {
    move (e) {
      if (!this.drag) return
      if (UA.ios || UA.mQQBrowser || UA.oldIOS) e.preventDefault() // 微信、IOS禁用下拉回弹
      e.stopPropagation()
      if (this.touchType === 1) {
        const touch = e.touches[0]
        let x = touch.clientX
        let y = touch.clientY

        let left = this.startPos.left + x - this.startPos.touchX
        let top = this.startPos.top + y - this.startPos.touchY

        let minLeft = ((this.limitElement.clientWidth - this.avatarWidth) / 2 + this.avatarWidth) - this.startPos.w
        let minTop = ((this.limitElement.clientHeight - this.avatarHeight) / 2 + this.avatarHeight) - this.startPos.h
        // max limit
        left = left <= this.maxLeft ? left : this.maxLeft
        top = top <= this.maxTop ? top : this.maxTop
        // min limit
        left = left >= minLeft ? left : minLeft
        top = top >= minTop ? top : minTop

        this.$el.style.left = left + 'px'
        this.$el.style.top = top + 'px'
      } else if (this.touchType === 2) {
        let axis1 = e.touches[0]
        let axis2 = e.touches[1]
        // 两个坐标距离
        let currentZoom = Math.floor(Math.sqrt(Math.pow(axis1.clientX - axis2.clientX, 2) + Math.pow(axis1.clientY - axis2.clientY, 2)))
        let distance = currentZoom - this.startZoom

        let width = this.startPos.w + distance
        if (width > this.width * 2) {
          distance = 0
          width = this.width * 2
        } else if (width < this.avatarWidth) {
          distance = 0
          width = this.avatarWidth
        }

        this.$el.style.width = width + 'px'
        this.$el.style.height = this.startPos.h * width / this.startPos.w + 'px'
        this.$el.style.left = (this.startPos.left - (width - this.startPos.w) / 2) + 'px'
        this.$el.style.top = (this.startPos.top - (this.startPos.h * width / this.startPos.w - this.startPos.h) / 2) + 'px'
      }
    },
    up (e) {
      $html.style.overflow = $html.getAttribute('old_overflow') || ''
      $body.style.overflow = $body.getAttribute('old_overflow') || ''
      if (this.touchType === 2) {
        let left = parseInt(this.$el.style.left)
        let top = parseInt(this.$el.style.top)
        let width = parseInt(this.$el.style.width)
        let height = parseInt(this.$el.style.height)
        let minLeft = ((this.limitElement.clientWidth - this.avatarWidth) / 2 + this.avatarWidth) - width
        let minTop = ((this.limitElement.clientHeight - this.avatarHeight) / 2 + this.avatarHeight) - height
        // max limit
        left = left <= this.maxLeft ? left : this.maxLeft
        top = top <= this.maxTop ? top : this.maxTop
        // min limit
        left = left >= minLeft ? left : minLeft
        top = top >= minTop ? top : minTop
        this.$el.style.webkitTransition = 'all .3s'
        this.$el.style.left = left + 'px'
        this.$el.style.top = top + 'px'
      }
    },
    start (e) {
      if (e.target.hasAttribute('image-dragble')) {
        this.drag = true
      } else {
        this.drag = false
        return
      }
      this.touchType = e.touches.length

      $html.style.overflow = 'hidden'
      $body.style.overflow = 'hidden'
      this.$el.style.webkitTransition = 'none'

      this.startPos.w = this.$el.clientWidth
      this.startPos.h = this.$el.clientHeight

      const parentPos = getElePos(this.limitElement)
      const targetPos = getElePos(this.$el)

      this.startPos.top = targetPos.top - parentPos.top
      this.startPos.left = targetPos.left - parentPos.left

      if (this.touchType === 1) { // drag
        const touch = e.touches[0]
        this.startPos.touchX = touch.clientX
        this.startPos.touchY = touch.clientY
      } else if (this.touchType === 2) { // zoom
        let axis1 = e.touches[0]
        let axis2 = e.touches[1]
        this.startZoom = Math.floor(Math.sqrt(Math.pow(axis1.clientX - axis2.clientX, 2) + Math.pow(axis1.clientY - axis2.clientY, 2)))
      }
    },

    getLimitElement (el) {
      const parentNode = el.parentNode
      const position = parentNode.style.position
      if (position === 'absolute' || position === 'relative' || position === 'fixed' || parentNode.nodeName === 'BODY') {
        return parentNode
      } else {
        return this.getLimitElement(parentNode)
      }
    }
  },

  mounted () {
    let $el = this.$el
    this.limitElement = this.getLimitElement($el)
    document.documentElement.addEventListener('touchmove', this.move, { passive: false })
    document.documentElement.addEventListener('touchend', this.up)
    document.documentElement.addEventListener('touchcancel', this.up)
    document.documentElement.addEventListener('touchstart', this.start)

    // store old overflow style
    $body.setAttribute('old_overflow', $html.style.overflow)
    $body.setAttribute('old_overflow', $body.style.overflow)
    // init image center
    this.$nextTick(_ => {
      $el.style.height = this.height + 'px'
      $el.style.width = this.width + 'px'
      $el.style.left = 0
      $el.style.top = (this.limitElement.clientHeight - this.height) / 2 + 'px'
    })
  },
  beforeDestroy: function () {
    document.documentElement.removeEventListener('touchmove', this.move)
    document.documentElement.removeEventListener('touchend', this.up)
    document.documentElement.removeEventListener('touchcancel', this.up)
    document.documentElement.removeEventListener('touchstart', this.start)
  }
}
</script>
