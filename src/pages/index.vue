<template>
  <div>
    <h1>头像设置</h1>
    <ul class="avatar-list">
      <li>
        <div class="avatar avatar-round">
          <img :src="src">
          <avatar-input
          class="avatar-input"
          @success="success"
          @error="error"
          :size="4"
          accept="image/*"
          />
        </div>
      </li>
    </ul>
    <avatar-crop
      :width="200"
      :height="200"
    ></avatar-crop>
  </div>
</template>

<script>
import {avatarCrop, avatarInput} from '@/components/avatar-crop/index.js'
const logo = require('@/assets/avatar.png')
export default {
  data () {
    return {
      src: logo
    }
  },
  methods: {
    success ({dataUrl, blob}) {
      // ajax upload img data
      this.src = dataUrl
      console.log(dataUrl)
      console.log(blob)
    },
    error (message) {
      console.log(message)
    }
  },
  components: {
    [avatarCrop.name]: avatarCrop,
    [avatarInput.name]: avatarInput
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1{text-align: center;font-size: 32px;color: #41B883;padding: 20px;}
.avatar-list{
  text-align: center;
  padding-top: 50px;
  li{
    padding-bottom: 20px;
    .avatar{
      display: inline-block;
      width: 128px;
      height: 128px;
      overflow: hidden;
      background-color: #eee;
      position: relative;
      // border: 2px solid #eee;
      box-shadow: 0 0 2px 2px rgba(0,0,0,.12);
      &.avatar-circel{
        border-radius: 40px;
      }
      &.avatar-round{
        border-radius: 12px;
      }
      .avatar-input{
        position: absolute;
        display: block;
        width: 128px;
        height: 128px;
        top:0;
        left: 0;
        font-size: 200px;
        opacity: 0;
        z-index: 10;
      }
      img{
        pointer-events: none;
        width: 100%;
      }
    }
  }
}
</style>
