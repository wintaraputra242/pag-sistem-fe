<template>
  <div class="dashboard-editor-container">

    <p class="text-center">COMMING SOON</p>
    <!-- <template>
      <div class="">
        <el-row :gutter="30">
          <el-col :span="24">
            <PenjualanCards v-if="dataCards.length > 0" :role="roleUser" :loading="isLoading" :data="dataCards" />
          </el-col>
          <el-col :span="24" style="margin-top: 30px;">
            <el-card>
              <GrafikKinerja type="line" />
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card>
              <div class="filter-container" style="margin-bottom: 8px;">
                <form @submit.prevent="handleFilter">
                  <el-date-picker
                    v-model="filters.bulanTahun"
                    type="month"
                    placeholder="Pilih Bulan & Tahun"
                    format="MM-yyyy"
                    value-format="M-yyyy"
                    style="margin: 5px 10px 5px 0"
                  />
                  <el-button native-type="submit" class="filter-item" style="margin: 3px 5px 5px 0" type="primary" icon="el-icon-search">
                    Cari
                  </el-button>
                  <el-button class="filter-item" style=" margin: 3px 5px 5px 0" type="info" icon="el-icon-refresh" @click="handleRefresh">
                    Refresh
                  </el-button>
                </form>
              </div>
              <h2 class="title-card">Data Per Tanggal</h2>
              <TableData :loading="isLoading" :data-table="dashboardData" :type="'per-tanggal'">
                <el-table-column
                  prop="tugas"
                  label="Tugas"
                >
                  <template slot-scope="{row}">
                    {{ row.tugas }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="tanggal"
                  min-width="150"
                  label="Tugas"
                >
                  <template slot-scope="{$index}">
                    {{ 'Tugas ' + ($index + 1) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="tanggal"
                  min-width="150"
                  label="Target Selesai"
                >
                  <template slot-scope="{row}">
                    {{ formatTanggal(row.tanggal) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="tanggal"
                  min-width="150"
                  label="PIC Sekarang"
                >
                  <template slot-scope="{row}">
                    {{ formatTanggal(row.tanggal) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="tanggal"
                  min-width="150"
                  label="Target"
                >
                  <template slot-scope="{row}">
                    {{ formatTanggal(row.tanggal) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="tanggal"
                  :width="isWidthMobile ? '70px' : '100px'"
                  :fixed="isWidthMobile ? 'right' : null"
                  label="Aksi"
                >
                  <template slot-scope="{row}">
                    <el-button type="info" icon="el-icon-document" size="small" @click="getDetail(row.id_tugas)" />
                  </template>
                </el-table-column>
              </TableData>
              <pagination class="pagination" :total="Number(totalDashboard)" :page.sync="filters.page" :limit.sync="filters.limit" @pagination="getList" />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </template> -->
    <!-- <el-dialog title="Detail" :visible.sync="dialogDetail" top="0px" style="padding: 20px 0;" :width="isWidthMobile ? '95%' : '60%'">
      <div>
        <TableData :loading="isLoading" :data-table="dashboardDataDetail" :type="'per-tanggal'">
          <el-table-column
            prop="0"
            label="No."
            width="50px"
          >
            <template slot-scope="{$index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="karyawan"
            width="150"
            label="PIC"
          >
            <template slot-scope="{row}">
              <span>{{ row.karyawan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Tujuan" width="150">
            <template slot-scope="{row}">
              <span>{{ row.tujuan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Bobot" width="150">
            <template slot-scope="{row}">
              <span>{{ row.bobot_text }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="target_selesai_format"
            width="150"
            label="Target Selesai"
          >
            <template slot-scope="{row}">
              <span>{{ row.target_selesai_format }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="waktu"
            width="150"
            label="Waktu"
          >
            <template slot-scope="{row}">
              <span>{{ row.waktu }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status_text"
            width="150"
            label="Status"
          >
            <template slot-scope="{row}">
              <span>{{ row.status_text }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="tgl_selesai"
            width="150"
            label="Tanggal Selesai"
          >
            <template slot-scope="{row}">
              <span>{{ row.tgl_selesai }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="keterangan"
            width="150"
            label="Keterangan"
          >
            <template slot-scope="{row}">
              <span>{{ row.keterangan }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="File"
            fixed="right"
            :width="isWidthMobile ? '70' : '100'"
          >
            <template slot-scope="{row}">
              <el-button v-if="row.file" icon="el-icon-download" type="success" size="mini" @click="downloadFile(row.file)" />
            </template>
          </el-table-column>
        </TableData>
        <pagination class="pagination" :total="Number(totalDashboardDetail)" :page.sync="filtersDetail.page" :limit.sync="filtersDetail.limit" @pagination="getDetail" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetail = false">
          Close
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
// import QrcodeVue from 'qrcode.vue'
// import accountInfo from './components/accountInfo.vue'
// import QrCard from './components/qrCard.vue'

// import use
import jsCookie from 'js-cookie'
// import TableData from './components/TableData.vue'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { unit_a, unit_b, unit_c } from '@/helpers/dataUser'

import { nama_site, email_site, alamat_site, id_site, jenis_id as id_jenis, sistem_site } from '@/helpers/dataUser'
// import { getDetail } from '@/api/dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    // QrcodeVue,
    // accountInfo,
    // QrCard
    // TableData,
    // Pagination
  },
  data() {
    return {
      nama_site,
      email_site,
      alamat_site,
      sistem_site,
      id_site,
      id_jenis,
      unit_a,
      unit_b,
      unit_c,
      roleUser: jsCookie.get('levelNum'),
      LAMBDA_URL: process.env.VUE_APP_LAMBDA_URL,
      filters: {
        page: 1,
        limit: 20,
        bulanTahun: ''
      },
      filtersDetail: {
        page: 1,
        limit: 20,
        id_tugas: ''
      },
      isLoading: false,
      dashboardData: [],
      dashboardDataDetail: [],
      totalDashboard: null,
      totalDashboardDetail: null,
      dataCards: [],
      dataGrafik: {},
      labelGrafik: [],
      no: 0,
      dialogDetail: false,
      isWidthMobile: false
    }
  },
  computed: {
    UrlQRCode() {
      return `${this.LAMBDA_URL}/ideathon-qr/${this.id_site}`
    },
    UrlQRCodeFlyer() {
      return `${this.LAMBDA_URL}/flyer/${this.id_site}?qr=true`
    },
    UrlFlyer() {
      return `${this.LAMBDA_URL}/flyer/${this.id_site}`
    },
    UrlQRCodeFlyerEvent() {
      return `${this.LAMBDA_URL}/flayerEvent/${this.id_site}?qr=true`
    },
    UrlFlyerEvent() {
      return `${this.LAMBDA_URL}/flayerEvent/${this.id_site}`
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    if (window.innerWidth < 1024) this.isWidthMobile = true
    window.onresize = e => {
      if (e.target.innerWidth < 1024) {
        this.isWidthMobile = true
        return
      }
      this.isWidthMobile = false
    }
  },
  methods: {
    getList(params) {
      this.isLoading = true
      const { page, limit, bulanTahun } = this.filters
      let bulan = ''
      let tahun = ''
      if (bulanTahun) {
        const [bulanSplit, tahunSplit] = bulanTahun.split('-')
        bulan = bulanSplit
        tahun = tahunSplit
      }
      this.$store.dispatch('dashboard/getDashboard', { page, limit, bulan, tahun }).then(response => {
        const dashboardData = this.$store.getters.dataDashboard
        const totalDashboard = this.$store.getters.totalDashboard
        this.dashboardData = dashboardData
        this.totalDashboard = totalDashboard

        this.isLoading = false
      })
    },
    getDetail(id) {
      this.dialogDetail = true
      this.isLoading = true
      this.dashboardDataDetail = []
      this.totalDashboardDetail = null
      this.filtersDetail.id_tugas = id
      this.$store.dispatch('dashboard/getDetailDashboard', this.filtersDetail).then(response => {
        const dashboardDataDetail = this.$store.getters.dataDetailDashboard
        const totalDashboardDetail = this.$store.getters.totalDetailDashboard
        // const totalData = this.$store.getters.totalTarget
        this.dashboardDataDetail = dashboardDataDetail
        this.totalDashboardDetail = totalDashboardDetail

        // console.log(this.dataGrafik)
        this.isLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    resetFilter() {
      this.filters = {
        page: 1,
        limit: 20,
        bulanTahun: ''
      }
    },
    handleRefresh() {
      this.resetFilter()
      this.getList()
    },
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
    formatTanggal(tanggal) {
      const split = tanggal.split('-')
      const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      return `${split[2]} ${bulan[Number(split[1]) - 1]} ${split[0]}`
    },
    setNo(numberStop) {
      // this.no += 1
      // if (this.no !== numberStop) {
      //   return this.no
      // }
      // return
    },
    downloadFile(file) {
      window.open(file, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  min-height: calc(100vh - 50px);
  padding: 20px 32px 20px 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .card-name {
    font-size: 25px;
    font-weight: bolder;
    text-align: center;
    margin-bottom: 0;
  }

  .card-subname {
    font-size: 16px;
    color: grey;
    font-weight: normal;
    text-align: center;
    display: block;
  }

  .card-wrapper{
    background: #fff;
    border-radius: 25px;
    margin-bottom: 20px;
    margin-top: 10px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .container-box-qr{
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width:1024px) {
}

.title-card {
    padding: 0;
    margin: 0 0 20px 0;
    text-align: center;
    position: relative;
    font-family: Poppins;
  }
</style>
