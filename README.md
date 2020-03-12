# v-avatar-crop

> vue 头像剪切

## 特性

* 头像剪切
* 头像拖拽缩放

## demo gif
<img src="https://dreamback.github.io/vue-avatar-crop/static/demo.gif"> 

## 手机扫码
<img src="https://dreamback.github.io/vue-avatar-crop/static/qrcode.png">  

[在线预览](https://dreamback.github.io/vue-avatar-crop/)


## 说明
配套包含两个组件
* `avatarInput` 封装`<input type="file"/>`负责选择文件
* `avatarCrop` 负责头像拖拽缩放裁剪等

## 像往常一样使用
```
npm i v-avatar-crop --save
```
组件引用
``` javascript
import {avatarCrop, avatarInput} from 'v-avatar-crop'
...
...
  components: {
    [avatarCrop.name]: avatarCrop,
    [avatarInput.name]: avatarInput
  },
  methods:{
    success ({dataUrl, blob}) {
      // ajax upload img data
      this.src = dataUrl
      console.log(dataUrl)
      console.log(blob)
    },
    error (message) {
      console.log(message)
    }
  }

```

``` html
<template>
<div>
  <!-- size 限制图片文件大小，M单位 -->
  <avatar-input
    @success="success"
    @error="error"
    :size="4" 
    accept="image/*"
  />

  ....

  <avatar-crop
    :width="200"
    :height="200"
  ></avatar-crop>

</div>
</template>
```


[github](https://github.com/dreamback/vue-avatar-crop)  

## 其它

图片压缩代码参考来自
https://github.com/didi/mand-mobile/tree/master/components/image-reader

## 开源协议

本项目基于 [MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89) 协议，请自由地享受和参与开源。