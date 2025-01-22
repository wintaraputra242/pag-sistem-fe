<template>
  <div class="dashboard-editor-container">
    <h1 style="text-align: center; font-family: Poppins; font-weight: 600;">UNIT</h1>
    <div class="app-container">
      <div class="filter-container" style="margin-bottom: 8px;">
        <div style="display: inline-block">
          <el-input
            v-model="filter.username"
            placeholder="Cari Username"
            style="width: 250px; margin: 3px 10px 0 0"
          />
        </div>
        <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select> -->
        <el-button v-waves class="filter-item" style="margin: -2px 5px 0 0" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button class="filter-item" style=" margin: -2px 5px 0 0" type="primary" icon="el-icon-edit" @click="handleCreate">
          Tambah
        </el-button>
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin: -2px 0 0 0" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="usertv.filter(data => !filter.username || data.username.toLowerCase().includes(filter.username.toLowerCase()))"
        highlight-current-row
        border
        style="width: 100%; border-radius: 6px;"
      >
        <el-table-column
          type="index"
          label="No."
          width="130px"
        />
        <el-table-column label="Username" min-width="70px">
          <template slot-scope="{row}">
            <span>{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row}">
            <el-button type="warning" size="" round @click="handleUpdate(row)">
              Edit
            </el-button>
            <el-button v-if="row.status!='deleted'" size="" round type="danger" @click="handleDelete(row.id_user)">
              Delete
            </el-button>
            <el-button type="primary" size="" round @click="handleSettingTV(row)">
              Setting TV
            </el-button>
            <el-button v-if="row.suara!=0" size="" round type="success" @click="handleModifyStatus(row, row.id_user, 0)">
              Voice Call
            </el-button>
            <el-button v-if="row.suara!=1" size="" round type="info" @click="handleModifyStatus(row, row.id_user, 1)">
              Mute
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination v-show="totaltv>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
      <!-- <pagination
        style="margin-top: 20px"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totaltv"
        @current-change="handleCurrentChange"
      /> -->

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="dialogStatus==='create' ? rules : rules2" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="Username" prop="username">
            <el-input v-model="temp.username" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <template>
              <el-input v-model="temp.password" show-password />
            </template>
          </el-form-item>
          <el-form-item label="Media TV" prop="tipe_media">
            <el-select v-model="temp.tipe_media" class="filter-item" placeholder="Please select">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="temp.tipe_media == 1 && dialogStatus === 'create' || temp.tipe_media == 1 && dialogStatus === 'update'" label="Link Video" prop="url">
            <el-input v-model="temp.url" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            Confirm
          </el-button>
        </div>
      </el-dialog>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          highlight-current-row
          :data="counter"
          style="width: 90%; margin:auto"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="spotID"
            label="No"
            width="180"
          />
          <el-table-column
            prop="namaSpot"
            label="User"
            width="180"
          />
          <el-table-column
            label="Act"
          >
            <template slot-scope="{row}">
              <el-button v-if="row.status_buka!=0" type="info" size="mini" @click="handleModifyStatusCounter(row, row.spotID, 2)">
                Tidak Tampil
              </el-button>
              <el-button v-if="row.status_buka!=1" size="mini" type="success" @click="handleModifyStatusCounter(row, row.spotID, 1)">
                Tampilkan
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">
            Close
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { updateUserTV, addUserTV, deleteUserTV } from '@/api/usertv'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { id_site as site_id } from '@/helpers/dataUser'

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
  // components: { Pagination },
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
    const validURL = (rule, value, callback) => {
      if (!value) {
        callback(new Error('url is required'))
      }
      setTimeout(() => {
        const valid = /^(https|http:\/\/[a-zA-Z0-9\.]+\/)(.*.mp4)/mgi
        if (!valid.test(value)) {
          callback(new Error('url not compatible'))
        } else {
          callback()
        }
      }, 500)
    }

    return {
      tableKey: 0,
      list: null,
      total: 0,
      totaltv: 0,
      listLoading: true,
      usertv: [],
      counter: [],
      site_id,
      filter: {
        username: ''
      },
      page_sizes: [2, 4, 6, 8],
      page_size: 4,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      pagination: true,
      password: '',
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        site: this.site_id,
        username: '',
        password: '',
        tipe_media: '',
        url: ''
      },
      temp2: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
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
        url: [
          { validator: validURL, trigger: 'blur' }
        ]
      },
      rules2: {
        tipe_media: [{ required: true, message: 'tipe_media is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        username: [{ required: true, message: 'username is required', trigger: 'blur' }]
        // password: [{ required: true, message: 'password is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.listLoading = false
    // this.getList()
    // setTimeout(() => {
    //   this.handleSizeChange(4)
    // }, 500)
  },
  methods: {
    getList(params) {
      this.listLoading = true
      this.$store.dispatch('usertv/userTVData', params).then(response => {
        const usertv = Object.values(this.$store.getters.dataUserTV)
        // this.$store.commit('usertv/SET_NEW_DATA_TV', usertv)
        // console.log(this.$store.getters.newDataTV);
        this.usertv = usertv
        this.totaltv = usertv.length

        // console.log(this.usertv);
        // Object.en

        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        const temp = this.temp
        if (valid) {
          addUserTV(new URLSearchParams({
            site: this.site_id,
            username: temp.username,
            password: temp.password,
            tipe_media: temp.tipe_media,
            url: temp.url
          }))
            .then((res) => {
              this.dialogFormVisible = false
              this.listLoading = true
              this.getList()
              this.listLoading = false
              this.$notify({
                title: 'Success',
                message: res.message,
                type: 'success',
                duration: 2000
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          const data = new URLSearchParams({
            site: this.site_id,
            id_user: tempData.id_user,
            username: tempData.username,
            tipe_media: tempData.tipe_media,
            url: ''
          })
          // eslint-disable-next-line eqeqeq
          if (tempData.password != undefined) {
            data.append('password', tempData.password)
          }
          // eslint-disable-next-line eqeqeq
          if (tempData.tipe_media == 1) {
            data.set('url', tempData.url)
          }
          updateUserTV(data).then((res) => {
            this.dialogFormVisible = false
            this.listLoading = true
            this.getList()
            this.listLoading = false
            this.$notify({
              title: 'Success',
              message: res.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('Yakin untuk menghapus data ini?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        title: 'Delete',
        type: 'warning'
      }).then(() => {
        deleteUserTV(new URLSearchParams({
          id_user: id
        }))
          .then(res => {
            this.getList()
            this.$notify({
              title: 'Success',
              message: res.message,
              type: 'success',
              duration: 2000
            })
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
      const sort = this.listQuery.sort
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
      this.usertv = this.$store.getters.dataTVSlice[this.$store.getters.valCurrentChange - 1]
      this.totaltv = data.length
    },
    handleCurrentChange(val) {
      this.$store.commit('usertv/SET_VAL_CURENT_CHANGE', val)
      this.usertv = this.$store.getters.dataTVSlice[val - 1]
    },
    changeFilter() {
      // console.log(event.target.value);
      if (this.filter.username !== '') {
        this.usertv = this.$store.getters.newDataTV
        let checked = false
        this.page_sizes.forEach(value => {
          // eslint-disable-next-line eqeqeq
          if (this.usertv.length == value) {
            checked = true
          }
        })
        if (checked === true) {
          this.page_size = this.usertv.length
        } else {
          this.page_sizes.push(this.usertv.length)
          // console.log(this.page_sizes);
          this.page_size = this.usertv.length
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
    }
  }
}
</script>

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
