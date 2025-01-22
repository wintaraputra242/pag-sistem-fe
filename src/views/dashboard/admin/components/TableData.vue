<template>
  <el-table
    :key="tableKey"
    v-loading="loading"
    stripe
    :data="dataTable"
    border
    fit
    highlight-current-row
    max-height="525px"
    style="width: 100%; border-radius: 6px;"
  >
    <el-table-column
      label="No"
      type="index"
      width="50"
    />
    <slot />
  </el-table>
</template>

<script>
// import FormFilterChart from './components/FormFilterChartBulanan.vue'
// import LineChart from './components/LineChartBulanan'
// import { readReportBulanan } from '@/api/report'
import { jenis_id, id_site as site_id } from '@/helpers/dataUser'
import jsCookie from 'js-cookie'

export default {
  components: {
    // GithubCorner,
    // LineChart,
    // FormFilterChart
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    dataTable: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      site_id,
      jenis_id,
      list: [],
      listLoading: false,
      loadingfilter: false,
      role: jsCookie.get('levelNum'),
      tableKey: 0,
      VisitorTotaPerHari: null,
      filter: {
        bulan: ('0' + (new Date().getMonth() + 1)).slice(-2),
        tahun: String(new Date().getFullYear()),
        counter: '',
        person: '00',
        status: ''
        // limit: 20,
        // page: 1
      },
      lineChartData: {
        tanggal: [],
        antrian: [],
        pemberi_rating: [],
        rata: [],
        datang: [],
        dilayani: [],
        batal: [],
        reject: []
      }
    }
  },
  computed: {
    column() {
      if (this.jenis_id === '11') {
        return {
          kolom1: 'Tanggal',
          kolom2: 'Jumlah Visitor',
          kolom3: 'Pemberi Rating',
          kolom4: 'Masuk',
          kolom5: 'Keluar',
          kolom6: 'Sakit',
          kolom7: 'Izin'
        }
      }
      return {
        kolom1: 'Tanggal',
        kolom2: 'Jumlah Visitor',
        kolom3: 'Pemberi Rating',
        kolom4: 'Datang',
        kolom5: 'Terlayani',
        kolom6: 'Batal',
        kolom7: 'Reject'
      }
    }
  },
  mounted() {
    // this.getReportBulanan()
  },
  unmounted() {
    this.lineChartData = {
      tanggal: [],
      antrian: [],
      pemberi_rating: [],
      rata: [],
      datang: [],
      dilayani: [],
      batal: [],
      reject: []
    }
  },
  methods: {
    formatDate(date) {
      const monthsName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const [year, month, day] = date.split('-') // 2022-12-01
      return `${day} ${monthsName[month - 1]} ${year}` // 01 Desember 2022
    },
    goToPilihReport() {
      this.$router.push({ name: 'Report' })
    },
    filterDataReportBulanan() {
      this.getReportBulanan(this.filter)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      if (columns && data) {
        columns.forEach((column, index) => {
          if (index === 0) {
            column.fixed = true
            sums[index] = ''
            return
          } else if (index === 1) {
            sums[index] = 'TOTAL'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = 'N/A'
          }
        })
      }
      return sums
    },
    getReportBulanan(params) {
      this.listLoading = true
      this.loadingfilter = true
      this.lineChartData = {
        tanggal: [],
        antrian: [],
        pemberi_rating: [],
        rata: [],
        datang: [],
        dilayani: [],
        batal: [],
        reject: []
      }
      params = { user: this.site_id, ...params }
      // readReportBulanan(params).then(res => {
      //   // const dataHarian = res.data_harian

      //   for (const key in Object.entries(res.data_harian)) {
      //     if (Object.hasOwnProperty.call(res.data_harian, key)) {
      //       this.lineChartData.tanggal.push(res.data_harian[key].tanggal)
      //       this.lineChartData.antrian.push(res.data_harian[key].antrian)
      //       this.lineChartData.pemberi_rating.push(res.data_harian[key].pemberi_rating)
      //       // this.lineChartData.rata.push(res.data_harian[key].rata)
      //       this.lineChartData.datang.push(res.data_harian[key].datang)
      //       this.lineChartData.dilayani.push(res.data_harian[key].dilayani)
      //       this.lineChartData.batal.push(res.data_harian[key].batal)
      //       this.lineChartData.reject.push(res.data_harian[key].reject)
      //     }
      //   }

      //   this.VisitorTotaPerHari = res.totaPerHari

      //   const arr = []
      //   for (const key in res.data_harian) {
      //     if (Object.hasOwnProperty.call(res.data_harian, key)) {
      //       arr.push(res.data_harian[key])
      //     }
      //   }
      //   this.list = arr
      // }).finally((_) => {
      //   this.listLoading = false
      //   this.loadingfilter = false
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 5px 32px 0px 32px;
  min-height: calc(100vh - 50px);
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .form-wrapper{
    background: #fff;
    margin-bottom: 20px;
    border-radius: 25px;
    padding: 16px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .chart-wrapper {
    background: #fff;
    // font-weight: normal;
    font-size: 0.8vw;
    margin-bottom: 20px;
    border-radius: 25px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

    h2{
      font-weight: normal;
    }

    .card-visitor{
      background: #6E85B7;
      max-width: 280px;
      padding: 15px;
      border-radius: 25px;
      margin: 0 auto 12px;
      color: #fff;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

      h3.title-card-visitor{
        padding: 0;
        margin: 0;
        font-size: 20px;
        text-align: center;
        text-transform: uppercase;
      }

      hr{
        border: 1px solid #fff;
        margin: 7px auto 10px;
        width: 35%;
      }

      h3.text-card-visitor{
        font-size: 40px;
        padding: 0;
        margin: 0;
        // width: 40%;
        text-align: center;
      }
    }

  }
  .chart-wrapper:nth-child(1) {
      padding: 16px;
  }

  .card-wrapper{
    background: #fff;
    margin-bottom: 20px;
    border-radius: 6px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  }
}

.title-chart{
  text-align: center
}

@media (max-width:1200px) {
  .dashboard-editor-container{

    .chart-wrapper {
      // display: none;
      font-size: 13px;
    }
  }
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;

  }
}

@media screen and (max-width: 768px) {
  .dashboard-editor-container{
    padding: 5px 15px 3px;
  }
}

@media screen and (max-width: 500px) {
  .dashboard-editor-container{
    .chart-wrapper{
      font-size: 2.7vw;
    }
  }
}

@media screen and (max-width: 365px) {
  .dashboard-editor-container{
    .chart-wrapper{
      .card-visitor{
        h3.title-card-visitor{
          font-size: 5.5vw;
        }
        h3.text-card-visitor{
          font-size: 9.8vw;
        }
      }
    }
  }
}
</style>

