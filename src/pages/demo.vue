<template>
  <div>
    <h1>头像设置</h1>
    <ul class="avatar-list">
      <li>
        <div class="avatar avatar-round">
          <avatar-input @success="success" />
          <img :src="src">
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
import {avatarCrop, avatarInput} from '../../lib/index.min'
// import {avatarCrop, avatarInput} from 'v-avatar-crop'
const logo = require('@/assets/avatar.png')
export default {
  data () {
    return {
      src: logo
    }
  },
  methods: {
    success ({dataUrl, blob, id}) {
      // ajax upload img data
      this.src = dataUrl
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
      input[type=file]{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        height: 0;
        font-size: 200px;
        opacity: 0;
      }
      img{
        width: 100%;
      }
    }
  }
}
</style>
