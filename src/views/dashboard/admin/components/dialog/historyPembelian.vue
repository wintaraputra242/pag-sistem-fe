<template>
  <el-dialog top="35px" width="95vw" :visible="visibility" @close="handleClose" @open="handleOpen">
    <div slot="title">
      <div class="title">History Pembelian Paket</div>
    </div>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :lg="5">
        <div class="input-div">
          <label for="dari" class="label-input">Dari Tanggal : </label>
          <br>
          <el-date-picker
            id="dari"
            v-model="historyfilter.dari"
            class="input"
            type="date"
            placeholder="Pilih Tanggal"
            size="large"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="5">
        <div class="input-div">
          <label for="sampai" class="label-input">Sampai Tanggal : </label>
          <br>
          <el-date-picker
            id="sampai"
            v-model="historyfilter.sampai"
            class="input"
            type="date"
            placeholder="Pilih Tanggal"
            size="large"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="5">
        <div class="input-div">
          <label for="kode_order" class="label-input">Kode Order : </label>
          <br>
          <el-input id="kode_order" v-model="historyfilter.kode_order" placeholder="Please input" class="input" size="large" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="5">
        <div class="input-div">
          <label for="status" class="label-input">Status : </label>
          <br>
          <el-select id="status" v-model="historyfilter.status" placeholder="Pilih status" clearable class="input " size="large" style="">
            <el-option v-for="(item, index) in statusOptions" :key="index" :label="item" :value="String(index)">{{ item }}</el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <div class="button-div" style="margin: 20px 0 0 0;">
          <el-button type="primary" size="large" class="button-filter" @click="filterHistoryPembelian">
            <svg-icon icon-class="search" /> Filter
          </el-button>
          <el-button :loading="loadingexcel" type="success" size="large" class="button-excel" @click="exportExcel">
            <svg-icon icon-class="excel" /> Export Excel
          </el-button>
        </div>
      </el-col>
    </el-row>
    <hr style="margin-top:20px">
    <el-table
      :data="data_history"
      stripe
      style="width: 100%; overflow: auto;"
    >
      <el-table-column
        label="Kode Order"
      >
        <template slot-scope="{row}">
          <span>{{ row.kode_order }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="Tanggal"
        width="200"
      >
        <template slot-scope="{row}">
          <span>{{ row.tgl_order | formatDate }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="Nama Paket"
      >
        <template slot-scope="{row}">
          <span>{{ row.nama_paket }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="Harga"
      >
        <template slot-scope="{row}">
          <span>{{ row.harga| formatRupiah }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="Kode Unik"
      >
        <template slot-scope="{row}">
          <span>{{ row.uniq_code }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="Total"
      >
        <template slot-scope="{row}">
          <span>{{ row.total | formatRupiah }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
      >
        <template slot-scope="{row}">
          <span>{{ row.status_text }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button type="info" plain @click="dialogHistory = false">
        Close
      </el-button> -->
      <pagination v-show="historyfilter.total>0" :total="historyfilter.total" :page.sync="historyfilter.page" :limit.sync="historyfilter.limit" @pagination="filterHistoryPembelian" />

    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'
import { exportHistoryOrder } from '@/api/package'
import { id_site as site_id } from '@/helpers/dataUser'

export default {
  filters: {
    formatDate(date) {
      date = String(date)
      const monthsName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const [day, month, year] = date.split('-') // 01-12-2022
      return `${day} ${monthsName[month - 1]} ${year}` // 01 Desember 2022
    },
    formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(number)
    }
  },
  components: {
    Pagination
  },
  props: {
    visibility: {
      type: Boolean
    }
  },
  data() {
    return {
      site_id,
      data_history: null,
      loadingexcel: false,
      historyfilter: {
        dari: new Date().toISOString().slice(0, 10),
        kode_order: '',
        sampai: new Date().toISOString().slice(0, 10),
        status: '',
        total: 0,
        page: 1,
        limit: 20
      },
      statusOptions: {
        '0': 'Menunggu Transfer',
        // '1': 'Check In',
        // '2': 'Diproses',
        '3': 'Sedang Diproses',
        // '4': 'Batal',
        // '5': 'Reject',
        '6': 'Sudah Diproses'
      }

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleOpen() {
      this.getHistoryPembelian(this.historyfilter)
    },
    handleClose() {
      this.$emit('closeDialog')
      this.resetFilter()
    },
    resetFilter() {
      this.historyfilter = {
        dari: new Date().toISOString().slice(0, 10),
        kode_order: '',
        sampai: new Date().toISOString().slice(0, 10),
        status: '',
        total: 0,
        page: 1,
        limit: 20
      }
    },
    getHistoryPembelian(params) {
      this.$store.dispatch('dashboard/getHistoryPembelian', params)
        .then(res => {
          this.data_history = res.history
          this.historyfilter.total = res.total
        }).catch(err => {
          const text_err = err?.message ?? 'Something Went Wrong'
          this.$message.error(text_err)
        })
    },
    filterHistoryPembelian() {
      this.getHistoryPembelian(this.historyfilter)
    },
    exportExcel() {
      this.$confirm('Download Excel Sekarang ?', 'Konfirmasi Excel', {
        confirmButtonText: 'Download',
        cancelButtonText: 'Cancel',
        roundButton: true,
        type: 'warning'
      }).then(() => {
        this.loadingexcel = true
        // pindah export di store (to do)
        import('@/vendor/Export2Excel').then(excel => {
          exportHistoryOrder({ id_site: this.site_id, ...this.historyfilter }).then(res => {
            if (res.success === true) {
              const replaceInArray = function(str) {
                return str.replace(/_/g, ' ')
              }
              const tHeader = Object.keys(res.data[0]).map(replaceInArray)
              const filterVal = Object.keys(res.data[0])
              const list = res.data
              const data = this.formatJson(filterVal, list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'SpeedQ-HistoryOrder',
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
            this.loadingexcel = false
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
.title {
  font-size: 24px;
  font-weight: 600;
}

.input-div{
  .input{
    margin: 5px 0 0 0;
    width: 100%;
  }
  .label-input{
    // color: #808080;
    font-weight: normal;
  }
}
</style>
