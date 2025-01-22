<template>
  <div>
    <el-row :gutter="40" class="panel-group" style="">
      <el-card class="box-card acc-info card-1" :body-style="bodyCardStyle">
        <div slot="header" class="clearfix" style="color: #fff;">
          <h2 class="title-card">User Pusat</h2>
        </div>
        <div class="card-body" style="margin-top: 5px;"> 1.200 </div>
      </el-card>
      <el-card class="box-card acc-info card-2" :body-style="bodyCardStyle">
        <div slot="header" class="clearfix" style="color: #fff;">
          <h2 class="title-card">User Cabang</h2>
        </div>
        <div class="card-body" style="margin-top: 5px;">1.900</div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
// import historyPembelian from './dialog/historyPembelian.vue'
// import tukarVoucher from './dialog/tukarVoucher.vue'
// import beliTiket from './dialog/beliTiket.vue'

export default {
  components: {
    // historyPembelian,
    // tukarVoucher,
    // beliTiket
  },
  filters: {
  },
  data() {
    return {
      bodyCardStyle: { 'background-color': '#fff', 'font-weight': '400' },
      dialogBuyTicket: false,
      dialogVoucher: false,
      dialogHistory: false,
      value: 3.7
    }
  },
  computed: {
    accountData() {
      return this.$store.getters.accountData
    }
  },
  mounted() {
    // this.$store.dispatch('dashboard/AccountInfo')
    //   .catch(err => {
    //     const text_err = err?.message ?? 'Something Went Wrong'
    //     this.$message.error(text_err)
    //   })
    this.checkPoint()
  },
  methods: {
    formatRibuan(val = 0) {
      if (val === '') {
        val = 0
      } else if (typeof val === 'string') {
        Number(val)
      } else if (typeof val !== 'number' || Number.isNaN(val)) {
        val = 0
      }
      const result = val.toString().split('').reverse().join('')
        .match(/\d{1,3}/g)
        .join('.').split('').reverse().join('')
      return result
    },
    checkPoint() {
      if (this.accountData?.poin_sisa <= 100) {
        document.querySelector('.sisa-tiket').classList.add('danger')
      } else if (this.accountData?.poin_sisa <= 300) {
        document.querySelector('.sisa-tiket').classList.add('warning')
      } else {
        document.querySelector('.sisa-tiket').classList.remove('warning')
        document.querySelector('.sisa-tiket').classList.remove('danger')
      }
    }
  }
}
</script>

<style>
  .box-card.acc-info .el-card__header{
    /* background-color: #304156; */
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }

  .box-card.acc-info.card-1 .el-card__header{
    background-color: #0ea5e9;
  }
  .box-card.acc-info.card-2 .el-card__header{
    background-color: #4f46e5;
  }
  /* .box-card.acc-info .el-card__body{ */
    /* padding: 0 !important; */
    /* height: 100%; */
  /* } */
  .box-card .el-rate .el-rate__icon{
    display: block;
    font-size: 30px !important;
  }
</style>

<style lang="scss" scoped>
.panel-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 350px;
    margin: 1vw;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    font-weight: 900
  }

  @keyframes effectWarn {
    50% {box-shadow: rgba(255, 230, 0, 0.5) 0px 3px 18px 18px;}
  }
  @keyframes effectDanger {
    50% {box-shadow: rgba(255, 51, 0, 0.5) 0px 3px 18px 18px;}
  }

  .box-card.warning {
    box-shadow: rgba(255, 230, 0, 0.5) 0px 3px 8px;
    animation: effectWarn 1.5s infinite;
  }
  .box-card.danger {
    box-shadow: rgba(255, 51, 0, 0.8) 0px 3px 8px;
    animation: effectDanger 1.5s infinite;
  }

  .card-body{
    height: 100%;
    // padding: 8px 0;
    font-size: 35px;
    font-weight: 600;
    text-align: center;
  }

  .button-data{
    margin: 1vw;
  }
}

@media (max-width:550px) {
  .button-data{
    width: 100%;
  }

  .box-card {
    margin: 2vw 3vw !important;
  }
}

.title-card {
  font-family: Poppins;
  padding: 0;
  margin: 0;
}
</style>
