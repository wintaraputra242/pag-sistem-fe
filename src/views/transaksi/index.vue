<template>
  <div class="dashboard-editor-container">
    <div class="header" style="margin-top: 10px;" />
    <div class="app-container">
      <p style="font-size: 25px; font-weight: bold;">
        <span>Transaction</span>
      </p>

      <div class="filter-container">
        <el-date-picker
          v-model="filter.tgl"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Tanggal"
          class="filter-item"
          style="width: 325px;  margin-right: 5px; "
          @blur="handleTGLfilter"
        />
        <el-select v-model="filter.status" placeholder="Status Pembayaran" clearable class="inline-input filter-item" size="" style="width: 200px; margin-right: 5px;">
          <el-option v-for="(item, index) in statusBayarOptions" :key="index" :label="item" :value="String(item)">{{ item }}</el-option>
        </el-select>
        <el-select v-model="filter.counter" placeholder="Pilih Counter" clearable class="inline-input filter-item" size="" style="width: 250px; margin-right: 5px;">
          <el-option v-for="(item, index) in counterOptions" :key="index" :label="item.namaSpot" :value="String(item.spotID)">{{ item.namaSpot }}</el-option>
        </el-select>

        <el-input v-model="filter.nama" placeholder="Nama" style="width: 250px; margin-right: 5px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-loading v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
          Search
        </el-button>
        <el-button v-waves:loading="downloadLoading" :disabled="total === 0" class="filter-item" type="success" icon="el-icon-download" @click="handleDownload">
          Export Excel
        </el-button>
        <el-button type="primary" icon="el-icon-refresh" size="" circle style="float: right;" @click="handleReset" />
        <br>
      </div>

      <summaryCard :data-summary="summaryTransaction" />
      <hr>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="dataTransaksi"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <template>
          <el-table-column
            label="No"
            type="index"
            :index="indexMethod"
            width="40"
          />
          <el-table-column label="Nama">
            <template slot-scope="{row}">
              <span>{{ row.nama }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Counter">
            <template slot-scope="{row}">
              <span>{{ row.counter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Ticket">
            <template slot-scope="{row}">
              <span>{{ row.ticket }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Tanggal" width="110">
            <template slot-scope="{row}">
              <span>{{ row.tanggal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Nominal (Rp)">
            <template slot-scope="{row}">
              <span>{{ row.harga | formatRibuan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Payment Fee (Rp)">
            <template slot-scope="{row}">
              <span>{{ row.fee | formatRibuan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Total (Rp)">
            <template slot-scope="{row}">
              <span>{{ row.total | formatRibuan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Status" class-name="status-col" width="100">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label=" Waktu Pembuatan" width="180">
            <template slot-scope="{row}">
              <span>{{ row.waktu }}</span>
            </template>
          </el-table-column>
        </template>

      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="filter.page" :limit.sync="filter.limit" @pagination="handleFilter" />

    </div>
  </div>
</template>

<script>
import summaryCard from './components/summaryCard.vue'
import { exportTransaktionData, readTransaktionData } from '@/api/transaksi'
import { id_site } from '@/helpers/dataUser'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'
import getDateDiff from '@/utils/getDateDiff'

const today = new Date().toISOString().slice(0, 10)

export default {
  name: 'ComplexTable',
  components: { Pagination, summaryCard },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'created': 'primary',
        'pending': 'warning',
        'authorize': 'info',
        'capture': 'success',
        'settlement': 'success',
        'expire': 'danger',
        'cancel': 'danger',
        'deny': 'danger',
        'failure': 'danger'
      }
      return statusMap[status]
    },
    formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(number)
    },
    formatRibuan(val) {
      if (val === '') { val = 0 } else if (typeof val === 'string') { Number(val) } else if (typeof val !== 'number' || Number.isNaN(val)) { val = 0 }

      const result = val.toString().split('').reverse().join('')
        .match(/\d{1,3}/g)
        .join('.').split('').reverse().join('')
      return result
    }
  },
  data() {
    return {
      summaryTransaction: {
        'Total Tiket': '0',
        'Total Transaction (Rp)': '0',
        'Total Success Fee (Rp)': '0',
        'Total Cash (Rp)': '0'
      },

      tableKey: 0,
      total: 0,
      dataTransaksi: [],
      listLoading: true,
      filter: {
        page: 1,
        limit: 20,
        tgl: [today, today],
        status: '',
        counter: '',
        nama: ''

      },
      imageUser: require('@/assets/all_image/user_no_image.png'),
      statusBayarOptions: [
        // 'created',
        // 'pending',
        // 'authorize',
        // 'capture',
        // 'settlement',
        // 'expire',
        // 'cancel',
        // 'deny',
        // 'failure'
      ],
      downloadLoading: false
    }
  },
  computed: {
    counterOptions() {
      return this.$store.getters.dataCounter
    }
  },
  mounted() {
    this.getList()
    this.$store.dispatch('counter/counterData')
  },
  methods: {
    getList() {
      this.listLoading = true
      const { page, counter, nama, status, tgl } = this.filter
      readTransaktionData({ user: id_site, page: page, counter: counter, nama: nama, status: status, tanggal: tgl })
        .then(res => {
          if (res.success === true) {
            this.statusBayarOptions = res.statusTransaksi
            this.dataTransaksi = res.dataTransaksi
            this.total = res.total
            this.summaryTransaction['Total Tiket'] = this.formatRibuan(res.transaksiSumary.TotalTiket)
            this.summaryTransaction['Total Transaction (Rp)'] = this.formatRibuan(res.transaksiSumary.TotalTransaction)
            this.summaryTransaction['Total Success Fee (Rp)'] = this.formatRibuan(res.transaksiSumary.TotalFee)
            this.summaryTransaction['Total Cash (Rp)'] = this.formatRibuan(res.transaksiSumary.TotalCash)
          } else {
            throw res
          }
        }).catch(err => {
          const text_err = err?.message ?? 'Error'
          this.$message.error(text_err)
        }).finally(() => {
          this.listLoading = false
        })
    },
    handleFilter() {
      this.getList()
    },
    handleReset() {
      this.filter = {
        page: 1,
        limit: 20,
        tgl: [today, today],
        status: '',
        counter: '',
        nama: ''

      }
      this.getList()
    },
    handleTGLfilter() {
      if (this.filter.tgl === '') {
        return
      }

      const [awal, akhir] = this.filter.tgl
      const diff = getDateDiff(awal, akhir)

      if (diff < 31) {
        return
      }
      this.filter.tgl = ''
      this.$message.warning('rentang tanggal maxsimum 31 hari')
    },
    formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(number)
    },
    formatRibuan(val) {
      if (val === '') { val = 0 } else if (typeof val === 'string') { Number(val) } else if (typeof val !== 'number' || Number.isNaN(val)) { val = 0 }

      const result = val.toString().split('').reverse().join('')
        .match(/\d{1,3}/g)
        .join('.').split('').reverse().join('')
      return result
    },
    indexMethod(index) {
      if (this.filter.page === 1) {
        return (index + 1)
      } else {
        const res = (index + 1) + (this.filter.limit * (this.filter.page - 1))
        return res
      }
    },
    handleDownload() {
      this.$confirm('Download Excel Sekarang ?', 'Konfirmasi Excel', {
        confirmButtonText: 'Download',
        cancelButtonText: 'Cancel',
        roundButton: true,
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const { counter, nama, status, tgl } = this.filter
          exportTransaktionData({ user: id_site, counter: counter, nama: nama, status: status, tanggal: tgl }).then(res => {
            if (res.success === true) {
              const replaceInArray = function(str) {
                return str.replace(/_/g, ' ')
              }
              const tHeader = Object.keys(res.dataTransaksi[0]).map(replaceInArray)
              const filterVal = Object.keys(res.dataTransaksi[0])
              const list = res.dataTransaksi
              const data = this.formatJson(filterVal, list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'SpeedQ-Transaksi',
                autoWidth: true,
                bookType: 'xlsx'
              })
            } else {
              this.$alert(res.message, 'Error', {
                confirmButtonText: 'OK',
                type: 'error'
              })
            }
          }).catch(error => {
            console.log(error)
          }).finally(() => {
            this.downloadLoading = false
          })
        })
      }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: 'Delete canceled'
        //   });
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>

  .dashboard-editor-container{
    padding: 5px 32px 25px 32px;
    background-color: rgb(240, 242, 245);
    min-height: calc(100vh - 50px);
    position: relative;

    hr{
      border: 1px solid #E0E0E0;
      margin:  20px 0 25px;
      background: #E0E0E0;
    }

    .app-container{
      background: rgb(255, 255, 255);
      border-radius: 25px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      margin-top: 20px;
    }

    .button-action {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: flex-start;
      align-content: stretch;
    }

    .pagination-container{
      margin: 0;
    }

    .no-antrian{
      cursor: pointer;
      padding: 0;
      width: 80px;
      height: 80px;
      margin: 8px;
      border-radius: 20%;
      background-color: #409EFF;
      color: white;
      box-shadow: 0px 4px 5px 0px rgba(150, 150, 150, 1)
    }

      .no-antrian:hover{
        background-color: #66b1ff;
      }

      .no-antrian:active {
        // background-color: #3e8e41;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        transform: translateY(4px);
      }

  }

  .demo-image__preview {
    margin: 10px 10px 10px 0px;
    display: inline-flex;
    flex-wrap: wrap;
  }
</style>
