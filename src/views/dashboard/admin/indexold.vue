<template>
  <div class="dashboard-editor-container">
    <!-- <div class="card-wrapper">
      <p class="card-name" style="font-size: 25px; font-weight: bold; text-align: center;">ACCOUNT INFORMATION</p>
      <p class="card-name">{{ nama_site }}</p>
      <span class="card-subname">{{ alamat_site }}</span>
      <span class="card-subname">{{ email_site }}</span>
      <accountInfo v-if="sistem_site == '1'" />
    </div> -->

    <!-- <el-row class="container-box-qr">
      <QrCard v-if="(id_jenis == '9' || id_jenis == '10')" title="QR Code" :path-download="UrlQRCode">
        <QrcodeVue style="margin: auto;" :size="250" :value="UrlQRCode" />
      </QrCard>
      <QrCard title="QR Code Flayer" :path-download="UrlQRCodeFlyer">
        <QrcodeVue style="margin: auto;" :size="250" :value="UrlQRCodeFlyer" />
      </QrCard>
      <QrCard title="Flayer" :path-download="UrlFlyer">
        <svg-icon icon-class="flyer" style="font-size:250px" />
      </QrCard>
      <QrCard title="QR Code Flayer (Event)" :path-download="UrlQRCodeFlyerEvent">
        <QrcodeVue style="margin: auto;" :size="250" :value="UrlQRCodeFlyerEvent" />
      </QrCard>
      <QrCard title="Flayer (Event)" :path-download="UrlFlyerEvent">
        <svg-icon icon-class="flyer" style="font-size:250px" />
      </QrCard>

    </el-row> -->

    <!-- <CountUser v-if="roleUser === '1'" /> -->

    <template>
      <!-- <el-card class="box-card">
        <el-form ref="filter" :model="filters" label-width="120px" :show-message="false" @submit.prevent="handleFilter">
          <el-form-item style="display: inline-block; margin: 0 !important;" label-width="0">
            <el-date-picker v-model="filters.bulan" type="month" format="MM-yyyy" value-format="MM-yyyy" placeholder="Bulan" class="filter-item" style="width: 200px;  margin-right: 5px; " />
          </el-form-item>
          <el-form-item style="display: inline-block; margin: 0 !important;" label-width="0">
            <el-date-picker v-model="filters.tahun" type="year" format="yyyy" value-format="yyyy" placeholder="Tahun" class="filter-item" style="width: 200px;  margin-right: 5px; " />
          </el-form-item>
          <el-form-item style="display: inline-block; margin: 0 !important;" label-width="0">
            <el-button native-type="submit" type="primary" size="medium" class="button-box-qr" @click="handleFilter">
              <i class="el-icon-search" /> Filter
            </el-button>
            <el-button type="info" size="medium" class="button-box-qr" @click="handleFilter">
              <i class="el-icon-refresh" /> Reset
            </el-button>
          </el-form-item>
        </el-form>
      </el-card> -->

      <div class="">
        <el-row :gutter="30">
          <el-col :span="24">
            <PenjualanCards v-if="dataCards.length > 0" :role="roleUser" :loading="isLoading" :data="dataCards" />
          </el-col>
          <!-- <el-col :span="24" style="margin-top: 30px;">
            <el-card>
              <GrafikKinerja type="line" />
            </el-card>
          </el-col> -->
          <el-col :span="24">
            <el-card>
              <h2 class="title-card">Data Per Tanggal</h2>
              <TableData :loading="isLoading" :data-table="dashboard.data_table_tanggal" :type="'per-tanggal'">
                <el-table-column
                  prop="tanggal"
                  label="Tanggal"
                  width="150"
                >
                  <template slot-scope="{row}">
                    {{ formatTanggal(row.tanggal) }}
                  </template>
                </el-table-column>
                <el-table-column v-if="roleUser !== '5'" align="center" label="Service SA">
                  <el-table-column
                    prop="sa_service_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_service_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sa_service_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_service_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '5'" align="center" label="Spare Part SA">
                  <el-table-column
                    prop="sa_sparepart_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_sparepart_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sa_sparepart_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_sparepart_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '5'" align="center" label="Aksesoris SA">
                  <el-table-column
                    prop="sa_accessoris_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_accessoris_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sa_accessoris_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_accessoris_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '4'" align="center" label="Penjualan SA">
                  <el-table-column
                    prop="sv_penjualan_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_penjualan_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sv_penjualan_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_penjualan_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '4'" align="center" label="Aksesoris SV">
                  <el-table-column
                    prop="sv_accessoris_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_accessoris_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sv_accessoris_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_accessoris_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '4'" align="center" :label="unit_a">
                  <el-table-column
                    prop="unit_a_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_a_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit_a_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_a_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '4'" align="center" :label="unit_b">
                  <el-table-column
                    prop="unit_b_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_b_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit_b_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_b_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '4'" align="center" :label="unit_c">
                  <el-table-column
                    prop="unit_c_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_c_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit_c_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_c_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column v-if="roleUser !== '4'" align="center" label="Kredit">
                  <el-table-column
                    prop="kredit_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.kredit_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="kredit_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.kredit_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
              </TableData>
            </el-card>
          </el-col>
          <el-col :span="24" style="margin-top: 30px;">
            <el-card>
              <h2 class="title-card">Grafik Input Dan Capaian</h2>
              <GrafikKinerja type="bar" :data="dataGrafik" :label="labelGrafik" />
            </el-card>
          </el-col>
          <el-col v-if="roleUser === '1' || roleUser === '2' || roleUser === '3'" :span="24" style="margin-top: 30px;">
            <el-card>
              <h2 class="title-card">Data Input dan Capaian</h2>
              <TableData :loading="isLoading" :data-table="dashboard.data_table_cabang" :type="'per-input-capaian'">
                <el-table-column
                  prop="cabang"
                  label="Cabang"
                >
                  <template slot-scope="{row}">
                    {{ row.cabang }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Service SA">
                  <el-table-column
                    prop="sa_service_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_service_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sa_service_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_service_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="Spare Part SA">
                  <el-table-column
                    prop="sa_sparepart_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_sparepart_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sa_sparepart_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_sparepart_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="Aksesoris SA">
                  <el-table-column
                    prop="sa_accessoris_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_accessoris_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sa_accessoris_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sa_accessoris_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="Aksesoris SA">
                  <el-table-column
                    prop="sv_penjualan_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_penjualan_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sv_penjualan_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_penjualan_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="Aksesoris SV">
                  <el-table-column
                    prop="sv_accessoris_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_accessoris_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sv_accessoris_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.sv_accessoris_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" :label="unit_a">
                  <el-table-column
                    prop="unit_a_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_a_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit_a_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_a_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" :label="unit_b">
                  <el-table-column
                    prop="unit_b_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_b_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit_b_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_b_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" :label="unit_c">
                  <el-table-column
                    prop="unit_c_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_c_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit_c_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.unit_c_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="Kredit">
                  <el-table-column
                    prop="kredit_target"
                    label="Target"
                    :width="'150px'"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.kredit_target) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="kredit_capaian"
                    label="Capaian"
                  >
                    <template slot-scope="{row}">
                      {{ formatRibuan(row.kredit_capaian) }}
                    </template>
                  </el-table-column>
                </el-table-column>
              </TableData>
            </el-card>
          </el-col>
        <!-- <el-card class="box-card acc-info card-2" :body-style="bodyCardStyle">
          <div slot="header" class="clearfix" style="color: #fff;">
            <h2 class="title-card">User Cabang</h2>
          </div>
          <div class="card-body" style="margin-top: 5px;">1.900</div>
        </el-card> -->
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
// import QrcodeVue from 'qrcode.vue'
// import accountInfo from './components/accountInfo.vue'
// import QrCard from './components/qrCard.vue'

// import use
import jsCookie from 'js-cookie'
import CountUser from './components/CountUser.vue'
import GrafikKinerja from './components/GrafikKinerja.vue'
import TableData from './components/TableData.vue'
import PenjualanCards from './components/PenjualanCards.vue'
import { unit_a, unit_b, unit_c } from '@/helpers/dataUser'

import { nama_site, email_site, alamat_site, id_site, jenis_id as id_jenis, sistem_site } from '@/helpers/dataUser'

export default {
  name: 'DashboardAdmin',
  components: {
    // QrcodeVue,
    // accountInfo,
    // QrCard
    CountUser,
    GrafikKinerja,
    TableData,
    PenjualanCards
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
        test: '',
        bulan: '',
        tahun: ''
      },
      isLoading: false,
      dashboard: {},
      dataCards: [],
      dataGrafik: {},
      labelGrafik: []
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
  methods: {
    handleFilter() {
      console.log('This Filter')
    },
    getList(params) {
      this.isLoading = true
      this.$store.dispatch('dashboard/getDashboard').then(response => {
        const dashboard = this.$store.getters.dataDashboard
        // const totalData = this.$store.getters.totalTarget
        this.dashboard = dashboard
        const cardTitles = { sa_service: 'Service SA', sa_sparepart: 'Spare Part SA', sa_accessoris: 'Aksesoris SA', sv_penjualan: 'Penjualan SV', sv_accessoris: 'Aksesoris SV', unit_a, unit_b, unit_c, kredit: 'Kredit' }
        const checkPersenCapaian = (capaian, target) => {
          const result = (capaian / target) * 100
          if (result === 100) return 'success'
          if (result >= 50) return 'warning'
          if (result >= 0) return 'danger'
        }
        Object.entries(this.dashboard.data_card).forEach((val, i) => {
          this.dataCards[i] = {}

          this.dataCards[i][val[0]] = val[1]
          this.dataCards[i]['status'] = checkPersenCapaian(val[1].capaian, val[1].target)
          this.dataCards[i]['title'] = cardTitles[val[0]]
          this.dataCards[i]['key'] = val[0]
        })

        // console.log(this.dataCards)

        this.labelGrafik = []
        this.dataGrafik = null
        const input = []
        const capaian = []
        Object.values(this.dashboard.data_grafik_input).forEach((val, i) => {
          this.labelGrafik.push(val.cabang)
          input.push(val.input)
          capaian.push(val.capaian)
        })
        this.dataGrafik = {
          input, capaian
        }
        // console.log(this.dataGrafik)
        this.isLoading = false
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  min-height: calc(100vh - 50px);
  padding: 20px 32px 32px 32px;
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
