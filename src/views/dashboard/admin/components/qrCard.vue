<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="title">{{ title }}</div>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button> -->
    </div>
    <slot />
    <el-button type="success" size="large" class="button-box-qr" @click="download">
      Download
    </el-button>
  </el-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    pathDownload: {
      type: String,
      required: true
    }
  },
  methods: {
    download() {
      window.open(this.pathDownload)
    }
  }
}
</script>

<style lang="scss" scoped>

.box-card {
  width: 290px;
  margin: 1vw;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: 900;
  }

  .button-box-qr {
    border-radius: 25px;
    width: 100%;
    margin-top: 10px;
  }
}
</style>
