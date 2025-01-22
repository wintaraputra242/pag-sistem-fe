<template>
  <div class="dashboard-editor-container">
    <h1 style="text-align: center; font-family: Poppins; font-weight: 600;">TUGAS</h1>
    <div class="app-container">
      <div class="filter-container" style="margin-bottom: 8px;">
        <form action="" @submit.prevent="handleFilter">
          <el-date-picker
            v-model="filter.bulanTahun"
            type="month"
            placeholder="Pilih Bulan & Tahun"
            format="MM-yyyy"
            value-format="M-yyyy"
            style="margin: 3px 10px 5px 0"
          />
          <el-input
            v-model="filter.tugas"
            placeholder="Cari Tugas"
            style="max-width: 250px; margin: 3px 10px 5px 0"
          />
          <el-select v-model="filter.status" placeholder="Pilih Status" style="margin: 3px 10px 5px 0" clearable>
            <el-option
              :key="'0'"
              :label="'Belum'"
              :value="'0'"
            />
            <el-option
              :key="'1'"
              :label="'Selesai'"
              :value="'1'"
            />
          </el-select>
          <!-- <el-select v-model="filter.sort" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select> -->
          <el-button v-waves class="filter-item" style="margin: 0px 5px 5px 0" type="primary" icon="el-icon-search" native-type="submit" @click="handleFilter">
            Cari
          </el-button>
          <el-button class="filter-item" style=" margin: 0px 5px 5px 0" type="info" icon="el-icon-refresh" @click="handleRefresh">
            Refresh
          </el-button>
          <el-button v-if="roleUser === '1'" class="filter-item" style=" margin: 0px 5px 5px 0" type="success" icon="el-icon-upload" @click="handleUpload">
            Upload
          </el-button>
          <el-button v-if="roleUser === '1'" class="filter-item" style=" margin: 0px 5px 5px 0" type="success" icon="el-icon-upload" @click="handleUploadTambahan">
            Upload Tambahan
          </el-button>
          <el-button v-if="roleUser === '1'" class="filter-item" style=" margin: 0px 5px 5px 0" type="primary" icon="el-icon-download" @click="downloadTemplate">
            Download Template
          </el-button>
        </form>
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin: -2px 0 0 0" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="tugasData"
        highlight-current-row
        border
        stripe
        style="width: 100%; border-radius: 6px;"
      >
        <el-table-column label="No." width="50px">
          <template slot-scope="{row}">
            <span>{{ row.no }}</span>
          </template>
        </el-table-column>
        <!-- min-width="200" -->
        <el-table-column label="Tugas" min-width="170px">
          <template slot-scope="{row}">
            <span>{{ row.tugas }}</span>
          </template>
        </el-table-column>
        <el-table-column label="PIC" min-width="170px">
          <template slot-scope="{row}">
            <span>{{ row.pic }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tujuan">
          <template slot-scope="{row}">
            <span>{{ row.tujuan }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Bobot">
          <template slot-scope="{row}">
            <span>{{ row.bobot_text }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Target" min-width="170px">
          <template slot-scope="{row}">
            <span>{{ row.target }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Waktu">
          <template slot-scope="{row}">
            <span>{{ row.no }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="Status" min-width="170px">
          <template slot-scope="{row}">
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Selesai" min-width="170px">
          <template slot-scope="{row}">
            <span>{{ row.selesai }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Keterangan" min-width="170px">
          <template slot-scope="{row}">
            <span>{{ row.keterangan || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Aksi" class-name="small-padding fixed-width" width="110" fixed="right">
          <template slot-scope="{row}">
            <div style="display: flex; flex-wrap: wrap; gap: 5px">
              <template v-if="row.status === 'Belum' && roleUser === '3'">
                <el-button style="margin: 0; width: 100%;" type="success" size="small" @click="handleUpdateStatus(row.id_detail, 1)">Selesai</el-button>
                <el-button style="margin: 0; width: 100%;" type="danger" size="small" @click="handleUpdateStatus(row.id_detail, 2)">Tidak Bisa</el-button>
              </template>
              <el-button v-if="row.file" style="margin: 0; width: 100%;" type="primary" size="small" @click="downloadFile(row.file)">Download</el-button>
              <span v-if="!row.file && row.status !== 'Belum'"> - </span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination class="pagination" :total="Number(totalTugasData)" :page.sync="filter.page" :limit.sync="filter.limit" @pagination="getList" />

      <el-dialog :title="formTitles[dialogStatus]" :visible.sync="dialogFormVisible" :width="isWidthMobile ? '95%' : ''" :top="isWidthMobile ? '0' : '60px'" style="padding: 20px 0;">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" style="width: 100%;" @submit.native.prevent="uploadData">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="form-item" label="Bulan & Tahun" prop="bulanTahun">
                <el-date-picker
                  v-model="temp.bulanTahun"
                  type="month"
                  placeholder="Pilih Bulan & Tahun"
                  format="MM-yyyy"
                  value-format="M-yyyy"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="form-item" label="File" prop="file">
                <!-- :auto-upload="false" -->
                <el-upload
                  ref="upload"
                  class="upload-demo upload-file"
                  :auto-upload="false"
                  drag
                  action=""
                  :file-list="fileList"
                  :limit="1"
                  :on-remove="handleRemoveFile"
                  :on-exceed="handleExceedFile"
                  accept=".xlsx"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">Drop file disini atau <em>klik untuk upload</em></div>
                  <div slot="tip" class="el-upload__tip">Hanya menerima file dengan format .xlsx</div>
                </el-upload>

              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer" style="float: right; margin-top: 10px;">
            <el-button type="info" icon="el-icon-close" @click="dialogFormVisible = false">
              Batal
            </el-button>
            <el-button type="success" icon="el-icon-check" :loading="loadingBtn" native-type="submit">
              Upload
            </el-button>
          </div>
          <div style="clear: both;" />
        </el-form>
      </el-dialog>

      <el-dialog :title="'Update Status ' + updateStatusTitle" :visible.sync="dialogFormVisibleUpdateStatus" :width="isWidthMobile ? '95%' : ''" :top="isWidthMobile ? '0' : '60px'" style="padding: 20px 0;">
        <el-form ref="dataFormUpdateStatus" :rules="rulesUpdateStatus" :model="tempUpdateStatus" label-position="top" style="width: 100%;" @submit.native.prevent="updateData">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="form-item" label="Keterangan" prop="keterangan">
                <el-input
                  v-model="tempUpdateStatus.keterangan"
                  type="textarea"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="updateStatusTitle === 'Selesai'" :span="24">
              <el-form-item class="form-item" label="File" prop="file">
                <!-- :auto-upload="false" -->
                <el-upload
                  ref="uploadUpdateStatus"
                  class="upload-demo upload-file"
                  :auto-upload="false"
                  drag
                  action=""
                  :file-list="fileListUpdateStatus"
                  :limit="1"
                  :on-remove="handleRemoveFileUpdateStatus"
                  :on-exceed="handleExceedFileUpdateStatus"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">Drop file disini atau <em>klik untuk upload</em></div>
                  <div slot="tip" class="el-upload__tip">File size maksimal 1MB</div>
                </el-upload>

              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer" style="float: right; margin-top: 10px;">
            <el-button type="info" icon="el-icon-close" @click="dialogFormVisibleUpdateStatus = false">
              Batal
            </el-button>
            <el-button type="success" icon="el-icon-check" :loading="loadingBtnUpdateStatus" native-type="submit">
              Simpan
            </el-button>
          </div>
          <div style="clear: both;" />
        </el-form>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            Confirm
          </el-button>
        </div> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { upload, edit as editTugas, uploadTambahan } from '@/api/tugas'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { id_site as site_id } from '@/helpers/dataUser'
import jsCookie from 'js-cookie'

const calendarTypeOptions = [
  { key: 0, display_name: 'Foto' },
  { key: 1, display_name: 'Video' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      totalTugasData: 0,
      totalTugasOld: 0,
      roleUser: jsCookie.get('levelNum'),
      listLoading: true,
      tugasData: [],
      tugasOld: [],
      counter: [],
      site_id,
      filter: {
        page: 1,
        limit: 20,
        bulanTahun: '',
        tugas: '',
        status: ''
      },
      page_sizes: [2, 4, 6, 8],
      page_size: 4,
      // listQuery: {
      //   page: 1,
      //   limit: 20,
      //   nama: '',
      //   username: '',
      //   status: ''
      //   // sort: '+id'
      // },
      pagination: true,
      password: '',
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        site: this.site_id,
        bulanTahun: '',
        file: ''
      },
      tempUpdateStatus: {
        // status: '',
        keterangan: '',
        file: ''
      },
      dialogFormVisible: false,
      dialogFormVisibleUpdateStatus: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Tambah',
        username: ''
      },
      currentPage: 1,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        bulanTahun: [{ required: true, message: 'bulan & tahun is required', trigger: 'change' }],
        file: [{ required: true, message: 'file is required', trigger: ['change', 'blur'] }]
        // url: [
        //   { validator: validURL, trigger: 'blur' }
        // ]
      },
      rulesUpdateStatus: {
        file: [{ required: true, message: 'file is required', trigger: ['change', 'blur'] }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        keterangan: [{ required: true, message: 'keterangan is required', trigger: 'blur' }]
        // password: [{ required: true, message: 'password is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      levelOptions: [{
        value: '1',
        label: 'Admin'
      }, {
        value: '2',
        label: 'Owner'
      }, {
        value: '3',
        label: 'Karyawan'
      }],
      statusOptions: [{
        value: '1',
        label: 'Aktif'
      }, {
        value: '2',
        label: 'Tidak Aktif'
      }],
      isFirstData: true,
      editPasswordStatus: false,
      isWidthMobile: false,
      file: '',
      fileUpdateStatus: '',
      fileList: [],
      fileListUpdateStatus: [],
      upload: null,
      updateStatusTitle: '',
      loadingBtn: false,
      loadingBtnUpdateStatus: false,
      formTitles: {
        'create': 'Upload',
        'tambahan': 'Upload Tambahan'
      }
    }
  },
  watch: {
    dialogFormVisible: function(newVal) {
      if (!newVal) {
        this.fileList = []
      }
    }
    // '$refs.upload': function(newVal) {
    //   console.log(newVal)
    // }
  },
  created() {
    // this.listLoading = false
    this.getList()
    // setTimeout(() => {
    //   this.handleSizeChange(4)
    // }, 500)
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
      this.listLoading = true
      const { page, limit, bulanTahun, tugas, status } = this.filter
      let bulan = ''
      let tahun = ''
      if (bulanTahun) {
        const [bulanSplit, tahunSplit] = bulanTahun.split('-')
        bulan = bulanSplit
        tahun = tahunSplit
      }
      this.$store.dispatch('tugas/getData', { page, limit, bulan, tahun, tugas, status }).then(response => {
        const tugasData = Object.values(this.$store.getters.dataTugas)
        const totalData = this.$store.getters.totalTugas
        // this.$store.commit('usertv/SET_NEW_DATA_TV', usertv)
        // console.log(this.$store.getters.newDataTV);
        const { bulanTahun, tugas, status } = this.filter
        const isAllFilterNull = !bulanTahun && !tugas && !status
        if (this.isFirstData || isAllFilterNull) {
          this.tugasOld = tugasData
          this.totalTugasOld = totalData
        }
        this.tugasData = tugasData
        this.totalTugasData = totalData

        this.isFirstData = false

        this.listLoading = false
      })
    },
    handleRefresh() {
      this.handleReset()
      this.getList()
    },
    handleFilter() {
      this.filter.page = 1
      this.getList()
    },
    handleReset() {
      this.filter.page = 1
      this.filter.limit = 20
      this.filter.bulanTahun = ''
      this.filter.tugas = ''
      this.filter.status = ''
      // this.tugasData = this.tugasOld
      // this.totalTugasData = this.totalTugasOld
    },
    resetTemp() {
      this.temp = {
        site: this.site_id,
        bulanTahun: '',
        file: ''
      }
    },
    resetTempUpdateStatus() {
      this.tempUpdateStatus = {
        site: this.site_id,
        keterangan: '',
        file: ''
      }
    },
    handleUpload() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUploadTambahan() {
      this.resetTemp()
      this.dialogStatus = 'tambahan'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    notifMessage(title, type, message) {
      this.$notify({
        title: title,
        message: message,
        type: type,
        duration: 2000
      })
    },
    uploadDataAPI: upload,
    uploadDataTambahanAPI: uploadTambahan,
    uploadData() {
      if (this.fileList.length === 0) this.temp.file = this.$refs.upload?.uploadFiles[0]?.raw
      if (this.fileList.length > 0) this.temp.file = this.fileList[0]
      this.$refs['dataForm'].validate((valid) => {
        const temp = this.temp
        const [bulan, tahun] = temp.bulanTahun.split('-')
        if (valid) {
          this.loadingBtn = true
          const formData = new FormData()
          formData.append('bulan', bulan)
          formData.append('tahun', tahun)
          formData.append('file', temp.file)
          this[this.dialogStatus === 'create' ? 'uploadDataAPI' : 'uploadDataTambahanAPI'](formData)
            .then((res) => {
              this.dialogFormVisible = false
              this.isFirstData = true
              this.handleReset()
              this.getList()
              this.loadingBtn = false
              if (res.success) {
                this.notifMessage('Berhasil', 'success', res.message)
                return
              }
              this.notifMessage('Gagal', 'error', res.message)
            })
        }
      })
    },
    handleUpdateStatus(id, status) {
      this.resetTempUpdateStatus()
      this.tempUpdateStatus['id_detail'] = id
      this.tempUpdateStatus['status'] = status
      this.dialogFormVisibleUpdateStatus = true
      const listStatus = {
        1: 'Selesai',
        2: 'Tidak Bisa'
      }
      this.updateStatusTitle = listStatus[status]
      this.$nextTick(() => {
        this.$refs['dataFormUpdateStatus'].clearValidate()
      })
    },
    updateData() {
      if (this.fileListUpdateStatus.length === 0) this.tempUpdateStatus.file = this.$refs.uploadUpdateStatus?.uploadFiles[0]?.raw
      if (this.fileListUpdateStatus.length > 0) this.tempUpdateStatus.file = this.fileListUpdateStatus[0]
      this.$refs['dataFormUpdateStatus'].validate((valid) => {
        if (valid) {
          this.loadingBtnUpdateStatus = true
          const temp = this.tempUpdateStatus
          const formData = new FormData()
          formData.append('id_detail', temp.id_detail)
          formData.append('keterangan', temp.keterangan)
          formData.append('status', temp.status)
          if (temp.status === 1) formData.append('fileUpload', temp.file)
          editTugas(formData).then((res) => {
            this.dialogFormVisibleUpdateStatus = false
            this.isFirstData = true
            this.handleReset()
            this.getList()
            this.loadingBtnUpdateStatus = false
            if (res.success) {
              this.notifMessage('Berhasil', 'success', res.message)
              return
            }
            this.notifMessage('Gagal', 'error', res.message)
          })
        }
      })
    },
    // handleDelete(id, nama) {
    //   this.$confirm('Yakin untuk menghapus data ini?', 'Warning', {
    //     confirmButtonText: 'Hapus',
    //     cancelButtonText: 'Batal',
    //     title: 'Hapus',
    //     type: 'warning'
    //   }).then(() => {
    //     const formData = new FormData()
    //     formData.append('nama', nama)
    //     formData.append('id_user', id)
    //     removeUser(formData)
    //       .then(res => {
    //         this.isFirstData = true
    //         this.handleReset()
    //         this.getList()
    //         if (res.success) {
    //           this.notifMessage('Berhasil', 'success', res.message)
    //           return
    //         }
    //         this.notifMessage('Gagal', 'error', res.message)
    //       }).catch(error => {
    //         console.error(error)
    //       })
    //   })
    // },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'Data_UserTV'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal) {
    //   return this.list.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    formatPhone() {
      this.temp.hp = this.temp.hp.replace(/[^0-9]/g, '')
    },
    downloadTemplate() {
      window.open(process.env.VUE_APP_BASE_API + 'tugas/Contoh_Tugas.xlsx')
    },
    // beforeUpload(file) {
    //   this.fileList = []
    //   this.temp.file = file
    //   this.fileList.push(file)
    //   console.log(this.temp.file, 'beforeUpload')
    // },
    handleRemoveFile(file, fileList) {
      this.temp.file = ''
    },
    // handleProgressFile(event, file, fileList) {
    //   console.log(file, 'handleProgressFile')
    // },
    handleExceedFile(files, fileList) {
      this.fileList = []
      this.fileList.push(files[0])
    },
    handleRemoveFileUpdateStatus(file, fileList) {
      this.tempUpdateStatus.file = ''
    },
    // handleProgressFile(event, file, fileList) {
    //   console.log(file, 'handleProgressFile')
    // },
    handleExceedFileUpdateStatus(files, fileList) {
      this.fileListUpdateStatus = []
      this.fileListUpdateStatus.push(files[0])
    },
    downloadFile(file) {
      window.open(file, '_blank')
    }
    // test() {
    //   console.log('test')
    // }
    // handleErrorFile(err, file, fileList) {
    //   console.log(err)
    // },
    // submitFile() {
    //   this.$refs.upload
    // },
    // batal() {
    //   console.log(this.$refs.upload?.uploadFiles[0]?.raw)
    // }
  }
}
</script>

<style lang="scss">
  .form-item .el-form-item__label{
    padding: 0 !important;
  }
  .pagination .el-pagination {
    white-space: wrap;
  }
  .upload-file .el-upload, .upload-file .el-upload-dragger {
    width: 100% !important;
  }
</style>
<style lang="scss" scoped>
  .dashboard-editor-container{
    padding: 5px 32px 25px 32px;
    min-height: calc(100vh - 50px);
    background-color: rgb(240, 242, 245);
    position: relative;

    .app-container{
      background: rgb(255, 255, 255);
      border-radius: 4px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    .pagination-container{
      margin: 0;
    }
  }
</style>
