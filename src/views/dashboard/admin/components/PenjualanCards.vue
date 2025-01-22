<template>
  <div>
    <el-row :gutter="30" justify="center" class="panel-group" style="">
      <el-col v-for="(item, i) in data" :key="i" :span="24" :md="8" style="margin-bottom: 30px;" :style="{ display: cardAccess[role].includes(item.key) ? 'block' : 'none' }">
        <el-card :class="`box-card card-${item.status}`" :body-style="bodyCardStyle" style="height: 100%;">
          <div slot="header" class="clearfix" style="color: #fff;">
            <span style="font-family: Poppins;">{{ item.title }}</span>
          </div>
          <div class="card-body" style="margin-top: 5px;">
            <table>
              <tr>
                <td>Target</td>
                <td style="padding-left: 8px;"> : <span style="padding-left: 5px;">{{ formatRupiah(item[item.key].target) }}</span></td>
              </tr>
              <tr>
                <td>Capaian</td>
                <td style="padding-left: 8px;"> : <span style="padding-left: 5px;">{{ formatRupiah(item[item.key].capaian) }}</span></td>
              </tr>
              <tr v-if="item[item.key].sisa">
                <td>Sisa</td>
                <td style="padding-left: 8px;"> : <span style="padding-left: 5px;">{{ formatRupiah(item[item.key].sisa) }}</span></td>
              </tr>
            </table>
            <div :class="item.status">
              <span :class="cardIcons[item.status]" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { isArray } from '@/utils/validate'

export default {
  filters: {
  },
  props: {
    role: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bodyCardStyle: { 'background-color': '#fff', 'font-weight': '400' },
      dialogBuyTicket: false,
      dialogVoucher: false,
      dialogHistory: false,
      value: 3.7,
      cardIcons: {
        success: 'el-icon-success',
        warning: 'el-icon-warning',
        danger: 'el-icon-error'
      },
      cardAccess: {
        '1': ['sa_service', 'sa_sparepart', 'sa_accessoris', 'sv_penjualan', 'sv_accessoris', 'unit_a', 'unit_b', 'unit_c', 'kredit'],
        '2': ['sa_service', 'sa_sparepart', 'sa_accessoris', 'sv_penjualan', 'sv_accessoris', 'unit_a', 'unit_b', 'unit_c', 'kredit'],
        '3': ['sa_service', 'sa_sparepart', 'sa_accessoris', 'sv_penjualan', 'sv_accessoris', 'unit_a', 'unit_b', 'unit_c', 'kredit'],
        '4': ['sa_service', 'sa_sparepart', 'sa_accessoris'],
        '5': ['sv_penjualan', 'sv_accessoris', 'unit_a', 'unit_b', 'unit_c', 'kredit'],
        '6': ['sa_service', 'sa_sparepart', 'sa_accessoris', 'sv_penjualan', 'sv_accessoris', 'unit_a', 'unit_b', 'unit_c', 'kredit']
        // ['1', '2', '3', '5', '6']
      },
      // accessCard: {
      //   service: ['1', '2', '3', '4', ]
      // }
      newData: []
    }
  },
  computed: {
    accountData() {
      return this.$store.getters.accountData
    }
  },
  watch: {
    '$props.data': function(val) {
      console.log(val)
    }
  },
  mounted() {
    // this.$store.dispatch('dashboard/AccountInfo')
    //   .catch(err => {
    //     const text_err = err?.message ?? 'Something Went Wrong'
    //     this.$message.error(text_err)
    //   })
    this.newData = this.$props.data
    // this.checkPoint()
    // console.log(this.cardAccess[0].includes(this.role))
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
    },
    formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(number)
    },
    test(i) {
      console.log(i)
    }
  }
}
</script>

<style>

  .box-card.card-success .el-card__header{
    background-color: #4ade80;
  }
  .box-card.card-warning .el-card__header{
    background-color: #facc15;
  }
  .box-card.card-danger .el-card__header{
    background-color: #ef4444;
  }
  .box-card .el-card__header{
    background-color: #1890ff;
    font-size: 20px;
    text-align: center;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }

  .box-card .el-card__body{
    padding-top: 10px;
    padding-bottom: 10px;
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
    width: 100%;
    // margin: 1vw;
    // border-radius: 15px;
    // box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    font-weight: 900

  }

  table tr td {
    padding-bottom: 10px;
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
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
      // padding: 8px 10px;
      // border: 3px solid #000;
      // border-radius: 50%;
      font-size: 4rem;
    }

    div.success{
      border-color: #4ade80;
      color: #4ade80;
    }
    div.warning{
      border-color: #facc15;
      color: #facc15;
    }
    div.danger{
      border-color: #ef4444;
      color: #ef4444;
    }
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
