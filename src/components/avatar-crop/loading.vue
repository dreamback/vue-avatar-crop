<template>
  <div class="spinner-snake-wrapper">
    <div class="spinner-snake" :style="{
      'border-top-color': spinnerColor,
      'border-left-color': spinnerColor,
      'border-bottom-color': spinnerColor,
      'height': spinnerSize,
      'width': spinnerSize
      }">
      </div>
  </div>
</template>

<script>

export default {
  name: 'loading',

  computed: {
    spinnerColor () {
      return this.color || this.$parent.color || '#ccc'
    }
  },

  props: {
    size: Number,
    color: String
  },
  data () {
    return {
      spinnerSize: '40px'
    }
  }
}
</script>

<style lang="css" scoped>
  .spinner-snake-wrapper{
    background-color: rgba(0,0,0,.5);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .spinner-snake {
    animation: spinner-rotate 0.8s infinite linear;
    border: 4px solid transparent;
    border-radius: 50%;
  }

  @keyframes spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
