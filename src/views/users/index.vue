<template>
  <div class="dashboard-editor-container">
    <h1 style="text-align: center; font-family: Poppins; font-weight: 600;">PENGGUNA</h1>
    <div class="app-container">
      <div class="filter-container" style="margin-bottom: 8px;">
        <form @submit.prevent="handleFilter">
          <el-input
            v-model="filter.nama"
            placeholder="Cari Nama"
            style="max-width: 250px; margin: 3px 10px 5px 0"
          />
          <el-input
            v-model="filter.username"
            placeholder="Cari Username"
            style="max-width: 250px; margin: 3px 10px 5px 0"
          />
          <el-select v-model="filter.status" placeholder="Pilih Status" style="margin: 3px 10px 5px 0" clearable>
            <el-option
              :key="'1'"
              :label="'Aktif'"
              :value="'1'"
            />
            <el-option
              :key="'2'"
              :label="'Tidak Aktif'"
              :value="'2'"
            />
          </el-select>
          <!-- <el-select v-model="filter.sort" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select> -->
          <el-button v-waves class="filter-item" style="margin: 0px 5px 5px 0" type="primary" icon="el-icon-search" native-type="submit">
            Cari
          </el-button>
          <el-button class="filter-item" style=" margin: 0px 5px 5px 0" type="info" icon="el-icon-refresh" @click="handleRefresh">
            Refresh
          </el-button>
          <el-button v-if="roleUser === '1'" class="filter-item" style=" margin: 0px 5px 5px 0" type="success" icon="el-icon-plus" @click="handleCreate">
            Tambah
          </el-button>
        </form>
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin: -2px 0 0 0" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="userPusat"
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
        <el-table-column label="Nama" min-width="200">
          <template slot-scope="{$index}">
            <!-- <span>{{ row.nama }}</span> -->
            <span>Nama {{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Username" min-width="200">
          <template slot-scope="{$index}">
            <!-- <span>{{ row.username }}</span> -->
            <span>Username {{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Level" min-width="200">
          <template slot-scope="{$index}">
            <!-- <span>{{ row.text_level }}</span> -->
            <span>{{ level[$index % 3] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" min-width="200">
          <template slot-scope="{}">
            <!-- <span>{{ row.status_text }}</span> -->
            <span>Aktif</span>
          </template>
        </el-table-column>
        <el-table-column v-if="roleUser === '1'" label="Aksi" class-name="small-padding fixed-width" min-width="110" fixed="right">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="handleUpdate(row)" />
            <el-button size="small" icon="el-icon-delete" type="danger" @click="handleDelete(row.id_user, row.nama)" />
          </template>
        </el-table-column>
      </el-table>

      <pagination class="pagination" :total="Number(totalUserPusat)" :page.sync="filter.page" :limit.sync="filter.limit" @pagination="getList" />
      <!-- <pagination
        style="margin-top: 20px"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalUserPusat"
        @current-change="handleCurrentChange"
      /> -->

      <el-dialog :title="textMap[dialogStatus]" :width="isWidthMobile ? '95%' : ''" :visible.sync="dialogFormVisible" :top="isWidthMobile ? '0' : '60px'" style="padding: 20px 0;">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" style="width: 100%;" @submit.native.prevent="dialogStatus==='create'?createData():updateData()">
          <el-row :gutter="20">
            <el-col :md="12" :span="24">
              <el-form-item class="form-item" label="Username" prop="username">
                <el-input v-model="temp.username" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :span="24">
              <el-form-item class="form-item" label="Nama" prop="nama">
                <el-input v-model="temp.nama" />
              </el-form-item>
            </el-col>
            <el-col :md="editPasswordStatus || dialogStatus === 'create' ? 12 : 24" :span="24">
              <el-form-item class="form-item" label="Password" prop="password">
                <template>
                  <div style="display: flex; gap: 10px;">
                    <el-input v-model="temp.password" show-password :disabled="!editPasswordStatus && dialogStatus !== 'create'" />
                    <el-button v-if="!editPasswordStatus && dialogStatus !== 'create'" type="primary" @click="editPasswordStatus = true">
                      Edit Password ?
                    </el-button>
                  </div>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="editPasswordStatus || dialogStatus === 'create'" :md="12" :span="24">
              <el-form-item class="form-item" label="Konfirmasi Password" prop="c_password">
                <template>
                  <div style="display: flex; gap: 10px;">
                    <el-input v-model="temp.c_password" show-password :disabled="!editPasswordStatus && dialogStatus !== 'create'" />
                  </div>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="editPasswordStatus" :span="24" style="display: flex; justify-content: center; margin-bottom: 10px;">
              <el-button type="info" icon="el-icon-close" @click="batalEditPassword">
                Batal
              </el-button>
            </el-col>
            <el-col :md="12" :span="24">
              <el-form-item class="form-item" label="Level" prop="level">
                <template>
                  <el-select v-model="temp.level" placeholder="Pilih" style="width: 100%" clearable>
                    <el-option
                      v-for="item in levelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="12" :span="24">
              <el-form-item class="form-item" label="Status" prop="status">
                <template>
                  <el-select v-model="temp.status" placeholder="Pilih" style="width: 100%" clearable>
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer" style="float: right; margin-top: 10px;">
            <el-button type="info" icon="el-icon-close" @click="dialogFormVisible = false">
              Batal
            </el-button>
            <el-button type="success" icon="el-icon-check" :loading="loadingBtn" native-type="submit">
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
import { create as createUser, edit as editUser, remove as removeUser } from '@/api/userPusat'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
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
    var validatePass = (rule, value, callback) => {
      if (!this.editPasswordStatus && this.dialogStatus === 'update') callback()

      if (!value) {
        callback(new Error('password is required'))
      } else {
        if (this.temp.c_password !== '') {
          this.$refs.dataForm.validateField('c_password')
        }
        callback()
      }
    }

    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('confirm password is required'))
      } else if (value !== this.temp.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }

    return {
      tableKey: 0,
      list: null,
      total: 0,
      totalUserPusat: 0,
      totalUserPusatOld: 0,
      roleUser: jsCookie.get('levelNum'),
      listLoading: true,
      userPusat: [],
      userPusatOld: [],
      counter: [],
      site_id,
      filter: {
        page: 1,
        limit: 20,
        nama: '',
        username: '',
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
        username: '',
        password: '',
        c_password: '',
        nama: '',
        level: '',
        status: ''
      },
      temp2: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
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
        username: [{ required: true, message: 'username is required', trigger: 'blur' }],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        c_password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        nama: [{ required: true, message: 'nama is required', trigger: 'blur' }],
        hp: [{ required: true, message: 'no. hp is required', trigger: 'blur' }],
        alamat: [{ required: true, message: 'alamat is required', trigger: 'blur' }],
        level: [{ required: true, message: 'level is required', trigger: 'change' }],
        status: [{ required: true, message: 'status is required', trigger: 'change' }]
        // url: [
        //   { validator: validURL, trigger: 'blur' }
        // ]
      },
      rules2: {
        tipe_media: [{ required: true, message: 'tipe_media is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        username: [{ required: true, message: 'username is required', trigger: 'blur' }]
        // password: [{ required: true, message: 'password is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      levelOptions: [{
        value: '1',
        label: 'Estimator'
      }, {
        value: '2',
        label: 'Sales'
      }, {
        value: '3',
        label: 'Furchasing'
      }, {
        value: '4',
        label: 'Gudang'
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
      loadingBtn: false,
      level: ['Estimator', 'Sales', 'Furchasing', 'Gudang']
    }
  },
  watch: {
    dialogFormVisible: function(newVal) {
      if (!newVal) {
        this.batalEditPassword()
      }
    }
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
      this.$store.dispatch('userPusat/getDataUserPusat', this.filter).then(response => {
        const userPusat = Object.values(this.$store.getters.dataUserPusat)
        const totalData = this.$store.getters.totalUserPusat
        // this.$store.commit('usertv/SET_NEW_DATA_TV', usertv)
        // console.log(this.$store.getters.newDataTV);
        const { nama, status, username } = this.filter
        const isAllFilterNull = !nama && !status && !username
        if (this.isFirstData || isAllFilterNull) {
          this.userPusatOld = userPusat
          this.totalUserPusatOld = totalData
        }
        this.userPusat = userPusat
        this.totalUserPusat = totalData

        console.log(this.totalUserPusat, this.totalUserPusatOld)

        this.isFirstData = false
        // console.log(this.userPusat);
        // Object.en

        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)

        this.listLoading = false
      })
    },
    batalEditPassword() {
      this.editPasswordStatus = false
      this.temp.password = ''
      this.temp.c_password = ''
      this.$refs.dataForm.clearValidate()
    },
    handleRefresh() {
      this.handleReset()
      this.getList()
    },
    handleFilter() {
      // const { nama, username, status } = this.filter
      // if (!nama && !username && !status) return
      this.filter.page = 1
      this.getList()
    },
    handleReset() {
      this.filter.page = 1
      this.filter.limit = 20
      this.filter.username = ''
      this.filter.nama = ''
      this.filter.status = ''
      this.userPusat = this.userPusatOld
      this.totalUserPusat = this.totalUserPusatOld
    },
    handleModifyStatus(row, id, status) {
      this.$store.dispatch('usertv/updateSuara',
        new URLSearchParams({ id_tv: id, status: status }))
        .then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          })
          row.suara = status
        }).catch(error => console.error(error))
    },
    resetTemp() {
      this.temp = {
        site: this.site_id,
        username: '',
        password: '',
        c_password: '',
        nama: '',
        level: '',
        status: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        const temp = this.temp
        if (valid) {
          this.loadingBtn = true
          const formData = new FormData()
          formData.append('username', temp.username)
          formData.append('password', temp.password)
          formData.append('nama', temp.nama)
          formData.append('id_level', temp.level)
          formData.append('status', temp.status)
          createUser(formData)
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
    handleUpdate(row) {
      const temp = Object.assign({}, row) // copy obj
      delete temp.no
      delete temp.status_text
      delete temp.text_level
      this.temp = temp
      this.temp.level = row.id_level
      this.temp.status = row.id_status
      delete this.temp.id_level
      delete this.temp.id_status
      console.log(this.temp)
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loadingBtn = true
          const temp = this.temp
          const formData = new FormData()
          formData.append('id_user', temp.id_user)
          formData.append('username', temp.username)
          formData.append('password', temp.password)
          formData.append('nama', temp.nama)
          formData.append('id_level', temp.level)
          formData.append('status', temp.status)
          editUser(formData).then((res) => {
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
    handleDelete(id, nama) {
      this.$confirm('Yakin untuk menghapus data ini?', 'Warning', {
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        title: 'Hapus',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('nama', nama)
        formData.append('id_user', id)
        removeUser(formData)
          .then(res => {
            this.isFirstData = true
            this.handleReset()
            this.getList()
            if (res.success) {
              this.notifMessage('Berhasil', 'success', res.message)
              return
            }
            this.notifMessage('Gagal', 'error', res.message)
          }).catch(error => {
            console.error(error)
          })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Data_UserTV'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    formatPhone() {
      this.temp.hp = this.temp.hp.replace(/[^0-9]/g, '')
    }
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
