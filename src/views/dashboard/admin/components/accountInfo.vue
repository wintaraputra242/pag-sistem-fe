<template>
  <div>
    <el-row :gutter="40" class="panel-group" style="">
      <el-card class="box-card acc-info" :body-style="bodyCardStyle">
        <div slot="header" class="clearfix" style="color: #fff;">
          <span>Paket</span>
        </div>
        <div class="card-body" style="margin-top: 5px;">{{ accountData.paket ? `${accountData.paket} (${formatRibuan(accountData.poin_paket)} Tiket)` : '-' }}</div>
      </el-card>
      <el-card class="box-card acc-info" :body-style="bodyCardStyle">
        <div slot="header" class="clearfix" style="color: #fff;">
          <span>Expired</span>
        </div>
        <div class="card-body" style="margin-top: 5px;">{{ accountData.expired || '-' }}</div>
      </el-card>
      <el-card ref="sisaTiket" class="box-card acc-info sisa-tiket" :body-style="bodyCardStyle">
        <div slot="header" class="clearfix" style="color: #fff;">
          <span>Sisa Tiket</span>
        </div>
        <div class="card-body" style="margin-top: 5px;">{{ formatRibuan(accountData.poin_sisa) || '-' }}</div>
      </el-card>
      <el-card class="box-card acc-info" :body-style="bodyCardStyle">
        <div slot="header" class="clearfix" style="color: #fff;">
          <span>Rating</span>
        </div>
        <div class="card-body" style="display: flex; justify-content: space-between; align-items: center;">
          <el-rate
            v-model="value"
            disabled
            class="rating-dash"
            style="justify-content: center; display: flex; height: 100%;"
            text-color="#ff9900"
          />
          <span>{{ value }} Points</span>
        </div>
      </el-card>
    </el-row>

    <el-row class="panel-group">
      <el-button type="success" round size="" style="" class="button-data" @click="dialogBuyTicket = true">
        <svg-icon icon-class="ticket" style="margin-right: 8px; font-size: 18px;" />
        Beli Tiket
      </el-button>
      <el-button type="warning" round size="" style="" class="button-data" @click="dialogVoucher = true">
        <svg-icon icon-class="coupon" style="margin-right: 8px; font-size: 18px;" />
        Tukar Voucher
      </el-button>
      <el-button type="primary" round size="" style="" class="button-data" @click="dialogHistory = true">
        <svg-icon icon-class="history" style="margin-right: 8px; font-size: 18px;" />
        History
      </el-button>
      <el-button type="info" round size="" style="" class="button-data" @click="dialogHistory = true">
        <i class="el-icon-question" style="margin-right: 8px; font-size: 18px;" />
        Bantuan
      </el-button>
    </el-row>

    <historyPembelian :visibility="dialogHistory" @closeDialog="dialogHistory = false" />
    <tukarVoucher :visibility="dialogVoucher" @closeDialog="dialogVoucher = false" />
    <beliTiket :visibility="dialogBuyTicket" @closeDialog="dialogBuyTicket = false" />
  </div>
</template>

<script>
import historyPembelian from './dialog/historyPembelian.vue'
import tukarVoucher from './dialog/tukarVoucher.vue'
import beliTiket from './dialog/beliTiket.vue'

export default {
  components: {
    historyPembelian,
    tukarVoucher,
    beliTiket
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
    this.$store.dispatch('dashboard/AccountInfo')
      .catch(err => {
        const text_err = err?.message ?? 'Something Went Wrong'
        this.$message.error(text_err)
      })
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
    background-color: #1890ff;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
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
</style>
