<template>
  <input @change="$_fileChange" type="file" :accept="accept" ca />
</template>
<script>
import createImageReader from './image-reader'
import imageProcessor from './image-processor'
import eventBus from './eventBus'
import {functionToUrl} from './util'
const ERROR = {
  100: '浏览器不支持',
  101: '图片文件太大',
  102: '图片读取失败',
  103: '图片数量超出限制'
}
export default {
  name: 'avatar-input',
  props: {
    size: {
      type: Number,
      default: 4
    },
    accept: {
      type: String,
      default: 'image/*'
    }
  },
  data () {
    return {
      isCancel: false
    }
  },
  methods: {
    $_fileChange (event) {
      const files = event.target.files
      const size = +this.size * 1024 * 1024
      let worker
      let count = 0
      eventBus.$emit('show', true)
      this.isCancel = false
      /* istanbul ignore if */
      if (window.Worker) {
        worker = this.$_openWebWorker(createImageReader)
        // worker send
        worker.postMessage({
          files,
          size: size,
          isWebWorker: true
        })
        // worker response
        worker.onmessage = evt => {
          this.$_onReaderComplete(evt.data)
          count++
          // shut down worker after all files have been read
          if (count === files.length) {
            this.$_closeWebWorker(worker)
          }
        }
      } else {
        // generate imageReader
        const imageReader = createImageReader(window)
        imageReader({
          files,
          size: size,
          isWebWorker: false,
          complete: this.$_onReaderComplete
        })
      }
    },
    $_openWebWorker (fn) {
      return new Worker(functionToUrl(fn))
    },
    $_onReaderComplete ({errorCode, file, dataUrl}) {
      if (errorCode === 0) {
        imageProcessor({dataUrl, width: 2000, height: 2000, quality: 0.8})
          .then(({ dataUrl, blob, width, height }) => {
            !this.isCancel && eventBus.$emit('imagePickerInit', { dataUrl, blob, width, height })
          }).catch(e => {
            this.$emit('error', e)
          })
      } else {
        this.$emit('error', ERROR[errorCode])
      }
    },
    $_closeWebWorker (worker) {
      worker.terminate()
    }
  },

  mounted () {
    eventBus.$on('cancel', _ => {
      this.isCancel = true
      this.$el.value = ''
    })
    eventBus.$on('success', res => {
      this.$emit('success', res)
    })
  }
}
</script>
