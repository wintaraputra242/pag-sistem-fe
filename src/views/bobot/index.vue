<template>
  <div class="dashboard-editor-container">
    <h1 style="text-align: center; font-family: Poppins; font-weight: 600;">BOBOT</h1>
    <div class="app-container">
      <div class="filter-container" style="margin-bottom: 8px;">
        <!-- <form action="" @submit.prevent="handleFilter"> -->
        <!-- <div style="display: inline-block">
          <el-input
            v-model="filter.nama"
            placeholder="Cari Nama"
            style="width: 250px; margin: 3px 10px 0 0"
          />
          <el-input
            v-model="filter.username"
            placeholder="Cari Username"
            style="width: 250px; margin: 3px 10px 0 0"
          />
          <el-select v-model="filter.status" placeholder="Pilih Status" style="margin: 3px 10px 0 0" clearable>
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
        </div> -->
        <!-- <el-select v-model="filter.sort" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select> -->
        <!-- <el-button v-waves class="filter-item" style="margin: -2px 5px 0 0" type="primary" icon="el-icon-search" @click="handleFilter">
          Cari
        </el-button>
        <el-button class="filter-item" style=" margin: -2px 5px 0 0" type="info" icon="el-icon-refresh" :disabled="totalUserPusat === totalUserPusatOld" @click="handleReset">
          Reset
        </el-button> -->
        <!-- <el-button v-if="!editStatus && roleUser !== '2'" class="filter-item" style=" margin: -2px 5px 0 0" type="primary" icon="el-icon-edit" @click="handleEdit">
          Edit
        </el-button>
        <template v-if="editStatus && roleUser !== '2'">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <el-button class="filter-item" style=" margin: -2px 5px 0 0" type="success" :disabled="totalBobot !== 100" icon="el-icon-check" @click="editDataBobot">
                Simpan
              </el-button>
              <el-button class="filter-item" style=" margin: -2px 5px 0 0" type="info" icon="el-icon-close" @click="editStatus = false">
                Batal
              </el-button>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; padding: 0; float: right">Total : <b>{{ totalBobot }}</b></p>
              <div style="clear: both;" />
              <p v-if="totalBobot !== 100" :style="{color: 'red', fontSize: 'small'}" style="margin: 0; padding: 0">Total keseluruhan bobot harus 100</p>
            </div>
          </div>
        </template> -->
        <!-- </form> -->
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin: -2px 0 0 0" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="bobot"
        highlight-current-row
        border
        stripe
        style="width: 100%; border-radius: 6px;"
      >
        <el-table-column label="No." width="60px">
          <template slot-scope="{row}">
            <span>{{ row.no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Cabang">
          <template slot-scope="{row}">
            <span>{{ row.cabang }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Service Advisor">
          <el-table-column label="Service">
            <template slot-scope="{row}">
              <span>{{ row.sa_service }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Sparepart">
            <template slot-scope="{row}">
              <span>{{ row.sa_sparepart }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Aksesoris">
            <template slot-scope="{row}">
              <span>{{ row.sa_accessoris }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="Supervisor">
          <el-table-column label="Penjualan">
            <template slot-scope="{row}">
              <span>{{ row.sv_penjualan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Aksesoris">
            <template slot-scope="{row}">
              <span>{{ row.sv_accessoris }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Unit A">
            <template slot-scope="{row}">
              <span>{{ row.unit_a }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Unit B">
            <template slot-scope="{row}">
              <span>{{ row.unit_b }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Unit C">
            <template slot-scope="{row}">
              <span>{{ row.unit_c }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Kredit">
            <template slot-scope="{row}">
              <span>{{ row.kredit }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column label="Alamat">
          <template slot-scope="{row}">
            <span>{{ row.alamat }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="Actions" width="165px" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="handleUpdate(row)"> Edit </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination :total="Number(totalUserPusat)" :page.sync="filter.page" :limit.sync="filter.limit" @pagination="getList" /> -->
      <!-- <pagination
        style="margin-top: 20px"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalUserPusat"
        @current-change="handleCurrentChange"
      /> -->

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="editStatus" top="60px">
        <el-form ref="dataForm" :rules="dialogStatus==='create' ? rules : rules2" :model="temp" label-position="top" style="width: 100%;" @submit.native.prevent="dialogStatus==='create'?createData():updateData()">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="form-item" label="Cabang" prop="cabang">
                <template>
                  <!-- <el-select v-model="temp.cabang" disabled placeholder="Pilih" style="width: 100%" clearable @focus="getComboCabang">
                    <el-option
                      v-for="(item, i) in cabangOptions"
                      :key="i"
                      :label="item.cabang"
                      :value="item.id_cabang"
                    />
                  </el-select> -->
                  <el-input v-model="temp.cabang" disabled type="text" />
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="8" :span="24">
              <el-form-item class="form-item" label="SA Service" prop="sa_service">
                <template>
                  <el-input v-model="temp.sa_service" type="number" @input="inputBobot" />
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="8" :span="24">
              <el-form-item class="form-item" label="SA Sparepart" prop="sa_sparepart">
                <template>
                  <el-input v-model="temp.sa_sparepart" type="number" @input="inputBobot" />
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="8" :span="24">
              <el-form-item class="form-item" label="SA Aksesoris" prop="sa_accessoris">
                <template>
                  <el-input v-model="temp.sa_accessoris" type="number" @input="inputBobot" />
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="dialogStatus === 'update' ? 8 : 12" :span="24">
              <el-form-item class="form-item" label="SV Penjualan" prop="sv_penjualan">
                <template>
                  <el-input v-model="temp.sv_penjualan" type="number" @input="inputBobot" />
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="dialogStatus === 'update' ? 8 : 12" :span="24">
              <el-form-item class="form-item" label="SV Aksesoris" prop="sv_accessoris">
                <template>
                  <el-input v-model="temp.sv_accessoris" type="number" @input="inputBobot" />
                </template>
              </el-form-item>
            </el-col>
            <template v-if="dialogStatus === 'update'">
              <el-col :md="8" :span="24">
                <el-form-item class="form-item" :label="'SV ' + unit_a" prop="unit_a">
                  <template>
                    <el-input v-model="temp.unit_a" type="number" @input="inputBobot" />
                  </template>
                </el-form-item>
              </el-col>
              <el-col :md="8" :span="24">
                <el-form-item class="form-item" :label="'SV ' + unit_b" prop="unit_b">
                  <template>
                    <el-input v-model="temp.unit_b" type="number" @input="inputBobot" />
                  </template>
                </el-form-item>
              </el-col>
              <el-col :md="8" :span="24">
                <el-form-item class="form-item" :label="'SV ' + unit_c" prop="unit_c">
                  <template>
                    <el-input v-model="temp.unit_c" type="number" @input="inputBobot" />
                  </template>
                </el-form-item>
              </el-col>
              <el-col :md="8" :span="24">
                <el-form-item class="form-item" label="SV Kredit" prop="kredit">
                  <template>
                    <el-input v-model="temp.kredit" type="number" @input="inputBobot" />
                  </template>
                </el-form-item>
              </el-col>
            </template>
            <!-- <el-col :span="24">
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
            </el-col> -->
            <div class="total text-center">
              <h3 style="margin: 12px 0 8px 0; padding: 0">Total : {{ totalBobot }}</h3>
              <p v-if="totalBobot !== 100" :style="{color: 'red', fontSize: 'small'}" style="margin: 0; padding: 0">Total keseluruhan bobot harus 100</p>
            </div>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editStatus = false">
            Cancel
          </el-button>
          <el-button :disabled="totalBobot !== 100" type="primary" @click="editDataBobot()">
            Confirm
          </el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { get as getBobot, edit as editBobot } from '@/api/bobot'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { id_site as site_id } from '@/helpers/dataUser'
import jsCookie from 'js-cookie'
import { unit_a, unit_b, unit_c } from '@/helpers/dataUser'

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
    // const validURL = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('url is required'))
    //   }
    //   setTimeout(() => {
    //     const valid = /^(https|http:\/\/[a-zA-Z0-9\.]+\/)(.*.mp4)/mgi
    //     if (!valid.test(value)) {
    //       callback(new Error('url not compatible'))
    //     } else {
    //       callback()
    //     }
    //   }, 500)
    // }

    return {
      unit_a, unit_b, unit_c,
      tableKey: 0,
      list: null,
      listLoading: true,
      bobot: [],
      counter: [],
      totalBobot: 0,
      roleUser: jsCookie.get('levelNum'),
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
        sa_service: '',
        sa_sparepart: '',
        sa_accessoris: '',
        sv_penjualan: '',
        sv_accessoris: '',
        unit_a: '',
        unit_b: '',
        unit_c: '',
        kredit: ''
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
        password: [{ required: true, message: 'password is required', trigger: 'blur' }],
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
        label: 'Super Admin'
      }, {
        value: '2',
        label: 'Owner'
      }, {
        value: '3',
        label: 'Pusat'
      }],
      statusOptions: [{
        value: '1',
        label: 'Aktif'
      }, {
        value: '2',
        label: 'Tidak Aktif'
      }],
      isFirstData: true,
      editStatus: false
    }
  },
  created() {
    // this.listLoading = false
    this.getList()
    // setTimeout(() => {
    //   this.handleSizeChange(4)
    // }, 500)
  },
  methods: {
    getList() {
      this.listLoading = true
      this.totalBobot = 0
      getBobot().then(res => {
        const bobot = Object.values(res.data)
        // this.$store.commit('usertv/SET_NEW_DATA_TV', usertv)
        // console.log(this.$store.getters.newDataTV);
        // const { bulanTahun, id_cabang, status } = this.filter
        // const isAllFilterNull = !bulanTahun && !status && !id_cabang
        // if (this.isFirstData || isAllFilterNull) {
        //   this.bobotOld = bobot
        // }
        this.bobot = bobot
        console.log(this.bobot)

        // console.log(this.totalBobot, this.totalBobotOld)

        this.isFirstData = false
        // console.log(this.bobot);
        // Object.en

        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      }).finally(() => {
        this.listLoading = false
      })
    },
    inputBobot() {
      const temp = this.temp
      this.totalBobot = Number(temp.sa_service) + Number(temp.sa_sparepart) + Number(temp.sa_accessoris) + Number(temp.sv_penjualan) + Number(temp.sv_accessoris) + Number(temp.unit_a) + Number(temp.unit_b) + Number(temp.unit_c) + Number(temp.kredit)
    },
    handleEdit() {
      this.editStatus = true
      const { sa_service, sa_sparepart, sa_accessoris, sv_penjualan, sv_accessoris, unit_a, unit_b, unit_c, kredit } = this.bobot[0]
      this.temp = {
        sa_service, sa_sparepart, sa_accessoris, sv_penjualan, sv_accessoris, unit_a, unit_b, unit_c, kredit
      }
    },
    editDataBobot() {
      const temp = this.temp
      const formData = new FormData()
      formData.append('id_bobot', temp.id_bobot)
      formData.append('sa_service', temp.sa_service)
      formData.append('sa_sparepart', temp.sa_sparepart)
      formData.append('sa_accessoris', temp.sa_accessoris)
      formData.append('sv_penjualan', temp.sv_penjualan)
      formData.append('sv_accessoris', temp.sv_accessoris)
      formData.append('unit_a', temp.unit_a)
      formData.append('unit_b', temp.unit_b)
      formData.append('unit_c', temp.unit_c)
      formData.append('kredit', temp.kredit)
      editBobot(formData).then(res => {
        this.editStatus = false
        if (res.success) {
          this.getList()
          this.notifMessage('Berhasil', 'success', res.message)
          return
        }
        this.notifMessage('Gagal', 'error', res.message)
      }).catch(err => {
        console.error(err)
      })
    },
    handleFilter() {
      // const { nama, username, status } = this.filter
      // if (!nama && !username && !status) return
      this.filter.page = 1
      this.getList()
    },
    handleReset() {
      this.filter.page = 1
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
    handleModifyStatusCounter(row, id, status) {
      this.temp2 = this.$store.getters.dataRowTV
      this.$store.dispatch('usertv/updateStatusCounter',
        new URLSearchParams({ id_counter: id, id_tv: this.temp2.id_user, status: status }))
        .then(res => {
          this.$store.dispatch('counter/updateStatusCounter',
            new URLSearchParams({ spot: id, status_on: status !== 1 ? 0 : 1 }))
            .then(res => {
              row.status_buka = status !== 1 ? 0 : 1
            })
          this.$message({
            message: res.message,
            type: 'success'
          })
        })
        .catch(error => console.log(error))
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.filter.sort = '+id'
      } else {
        this.filter.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        site: this.site_id,
        username: '',
        password: '',
        nama: '',
        alamat: '',
        hp: '',
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
          const formData = new FormData()
          formData.append('username', temp.username)
          formData.append('password', temp.password)
          formData.append('nama', temp.nama)
          formData.append('alamat', temp.alamat)
          formData.append('id_level', temp.level)
          formData.append('status', temp.status)
          formData.append('hp', temp.hp)
          createUser(formData)
            .then((res) => {
              this.dialogFormVisible = false
              this.listLoading = true
              this.isFirstData = true
              this.getList()
              this.listLoading = false
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
      this.temp = Object.assign({}, row) // copy obj
      this.temp['level'] = row.id_level
      this.inputBobot()
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.editStatus = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = this.temp
          const formData = new FormData()
          formData.append('id_user', temp.id_user)
          formData.append('username', temp.username)
          formData.append('password', temp.password)
          formData.append('nama', temp.nama)
          formData.append('alamat', temp.alamat)
          formData.append('id_level', temp.level)
          formData.append('status', temp.status)
          formData.append('hp', temp.hp)
          editUser(formData).then((res) => {
            this.dialogFormVisible = false
            this.listLoading = true
            this.isFirstData = true
            this.getList()
            this.listLoading = false
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
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        title: 'Delete',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('nama', nama)
        formData.append('id_user', id)
        removeUser(formData)
          .then(res => {
            this.isFirstData = true
            this.getList()
            if (res.success) {
              this.notifMessage('Berhasil', 'success', res.message)
              return
            }
            this.notifMessage('Gagal', 'error', res.message)
          }).catch(error => {
            console.error(error)
          })
      }).catch(() => {
        // this.$notify({
        //   type: 'info',
        //   message: 'Delete canceled',
        //   duration: 2000
        // })
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
    handleSettingTV(row) {
      this.temp = Object.assign({}, row)
      this.$store.commit('usertv/SET_DATA_ROWTV', this.temp)
      const wordSlice = this.temp.username.slice(0, 1)
      const alphabet = wordSlice.toUpperCase()
      const newWorld = alphabet + this.temp.username.slice(1, this.temp.username.length)
      this.textMap.username = newWorld
      this.dialogStatus = 'username'
      this.dialogFormVisible2 = true
      readCounter(new URLSearchParams({ user: this.temp.id_user }))
        .then(res => {
          this.counter = Object.values(res.data)
          // console.log(this.counter)
        })
        .catch(error => {
          if (error.message === 'Data Empty') {
            this.counter = []
          }
        })
      // console.log(this.counter);
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
    getSortClass: function(key) {
      const sort = this.filter.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleSizeChange(val) {
      const data = this.$store.getters.newDataTV
      const newData = []
      let a = 0
      const b = val
      for (let i = 0; i < data.length; i++) {
        if (i === a) {
          newData.push(data.slice(a, val))
          a = val
          val += b
        }
      }
      this.$store.commit('usertv/SET_DATA_TV_SLICE', newData)
      this.userPusat = this.$store.getters.dataTVSlice[this.$store.getters.valCurrentChange - 1]
      this.totalUserPusat = data.length
    },
    handleCurrentChange(val) {
      this.$store.commit('usertv/SET_VAL_CURENT_CHANGE', val)
      this.userPusat = this.$store.getters.dataTVSlice[val - 1]
    },
    changeFilter() {
      // console.log(event.target.value);
      if (this.filter.username !== '') {
        this.userPusat = this.$store.getters.newDataTV
        let checked = false
        this.page_sizes.forEach(value => {
          // eslint-disable-next-line eqeqeq
          if (this.userPusat.length == value) {
            checked = true
          }
        })
        if (checked === true) {
          this.page_size = this.userPusat.length
        } else {
          this.page_sizes.push(this.userPusat.length)
          // console.log(this.page_sizes);
          this.page_size = this.userPusat.length
        }
        this.pagination = true
      } else {
        // eslint-disable-next-line eqeqeq
        if (this.page_sizes.length != 4) {
          this.page_sizes.pop()
        }
        // console.log(this.page_sizes);
        this.handleSizeChange(4)
        this.page_size = 4
        this.pagination = false
      }
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
