<template>
  <div class="avatar-crop" v-show="visible">
    <template v-if="dataUrl">
      <image-picker
      class="image-picker"
      ref="imagePicker"
      v-if="pickerWidth&&pickerHeight"
      :width="pickerWidth"
      :height="pickerHeight"
      :maxLeft="this.avatarLeft"
      :maxTop="this.avatarTop"
      :avatarWidth="this.width"
      :avatarHeight="this.height"
      :src="dataUrl" />
      <div
        class="avatar-shutter"
        :style="{
          width: this.width + 'px',
          height: this.height + 'px',
          top: this.avatarTop + 'px',
          left: this.avatarLeft + 'px'
        }"
      ></div>
    </template>
    <loading v-else/>
    <i class="icon icon-close" @click="$_cancel"></i>
    <i v-if="dataUrl" class="icon icon-check" @click="$_createAvatar"></i>
  </div>
</template>
<script>
import loading from './loading'
import imagePicker from './image-picker'
import {dataURItoBlob} from './image-dataurl'
import eventBus from './eventBus'
import {UA} from './util'
export default {
  name: 'avatar-crop',
  props: {
    width: Number,
    height: Number
  },

  data () {
    return {
      cWidth: 0,
      cHeight: 0,
      avatarTop: 0,
      avatarLeft: 0,
      dataUrl: '',
      pickerWidth: 0,
      pickerHeight: 0,
      visible: false
    }
  },

  methods: {
    $_createAvatar () {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = this.width
      canvas.height = this.height

      let $img = this.$refs.imagePicker.$el

      let x = parseInt($img.style.left) - this.avatarLeft
      let y = parseInt($img.style.top) - this.avatarTop

      ctx.drawImage($img, x, y, parseInt($img.style.width), parseInt($img.style.height))

      let dataUrl
      let quality = 1

      if (UA.oldIOS || UA.oldAndroid || UA.mQQBrowser || !navigator.userAgent) {
        /* global JPEGEncoder */
        const encoder = new JPEGEncoder()
        const newImg = ctx.getImageData(0, 0, canvas.width, canvas.height)
        dataUrl = encoder.encode(newImg, quality * 100)
      } else {
        dataUrl = canvas.toDataURL('image/jpeg', quality)
      }

      eventBus.$emit('success', {dataUrl, blob: dataURItoBlob(dataUrl)})
      this.$_cancel()
      this.dataUrl = ''
      this.pickerWidth = 0
    },

    $_cancel () {
      this.visible = false
      eventBus.$emit('cancel')
      this.dataUrl = ''
      this.pickerWidth = 0
    }
  },
  mounted () {
    eventBus.$on('imagePickerInit', ({ dataUrl, blob, width, height }) => {
      this.dataUrl = dataUrl
      this.$nextTick(_ => {
        this.cWidth = this.$el.clientWidth
        this.cHeight = this.$el.clientHeight

        this.avatarLeft = (this.cWidth - this.width) / 2
        this.avatarTop = (this.cHeight - this.height) / 2

        let iHeight = height * this.cWidth / width
        this.pickerWidth = this.cWidth
        this.pickerHeight = iHeight
      })
    })
    eventBus.$on('show', visible => {
      this.visible = visible
    })
  },
  components: {
    [imagePicker.name]: imagePicker,
    loading
  }
}
</script>
<style lang="less" scoped>
.avatar-crop {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: fixed;
  background-color: rgba(0,0,0,.8);
  .avatar-shutter {
    position: absolute;
    outline: 500px solid rgba(0, 0, 0, 0.6);
    pointer-events: none;
  }
  .image-picker{
    position: absolute;
  }
  .icon{
    width: 30px;
    height: 30px;
    display: inline-block;
    background-size: cover;
    position: absolute;
    top: 20px;
    &.icon-close{
      left: 20px;
      background-image: url('../../assets/close.png');
    }
    &.icon-check{
      right: 20px;
      background-image: url('../../assets/check.png');
    }
  }
}
</style>
