<template>
  <div class="card">
    <el-row :gutter="0" class="rowWrapper">
      <el-card v-for="(value, name, index) in dataSummary" :key="index" class="content" style="color: white;" :style="{'background-color': bgColor[index]}">
        <div slot="header" class="clearfix content__small">
          {{ name }}
        </div>
        <div class="content__big">
          {{ value }}
        </div>
        <div class="content__small" />
      </el-card>
    </el-row>
  </div>
</template>

<script>

export default {
  filters: {

  },
  props: {
    dataSummary: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      bgColor: [
        // 'rgba(243, 129, 129, 0.85)',
        // 'rgba(252, 227, 138, 0.85)',
        // 'rgba(234, 255, 228, 1)',
        // 'rgba(149, 225, 211, 0.5)'
        // 'rgb(22, 24, 83)',
        // 'rgb(41, 44, 109)',
        // 'rgb(236, 37, 90)',
        // 'rgb(210, 19, 18)'
        'rgb(54, 163, 247)',
        'rgba(52, 191, 163, 1)',
        'rgba(244, 81, 108, 1)',
        'rgba(72, 122, 180, .7)'
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.card {
  border-radius: 25px;
  padding: 10px 0px;

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .rowWrapper {
    padding: 0;
    margin: auto;
    text-align: center;
    width: 100%;
    .content {
      font: 100%/1.5 "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, Calibri, sans-serif;
      // font-family: "Source Sans Pro", "Open Sans", "Gill Sans MT", "Gill Sans", Corbel, Arial, sans-serif;
      margin: 1rem;
      border-radius: 15px ;

        -webkit-text-size-adjust: 100%;
        display: inline-block;
        color: #333;
        z-index: 1;
        padding: 15px 40px 10px 30px;
        // border: solid 2px #333;
        min-width: 330px;
        max-width: 50%;
        box-sizing: border-box;

      // &:first-child{
      //   border-radius: 15px 0px 0px 15px;
      // }
      // &:last-child {
      //   border-radius: 0px 15px 15px 0px;
      // }

      &__big{
        font-size: 35px;
      }

      &__small {
        font-size: 1.25em;
        font-weight: 700;
      }
    }

  }

}
</style>
