<template>
  <div class="dashboard-editor-container">
    <h1 style="text-align: center; font-family: Poppins; font-weight: 600;">KINERJA</h1>
    <div class="app-container">
      <div class="filter-container" style="margin-bottom: 8px;">
        <!-- <form action="" @submit.prevent="handleFilter"> -->
        <!-- <div style="display: inline-block"> -->
        <el-date-picker
          v-model="filter.bulanTahun"
          type="month"
          placeholder="Pilih Bulan & Tahun"
          value-format="MM-yyyy"
          format="MM-yyyy"
          style="width: 250px; margin: 3px 10px 10px 0"
        />
        <!-- v-if="
            role === '1' ||
              role === '2' ||
              role === '3'
          " -->
        <el-select
          v-model="filter.id_cabang"
          placeholder="Pilih Cabang"
          style="margin: 3px 10px 10px 0"
          clearable
          :loading="isLoadComboCabang"
          @focus="getComboCabang"
        >
          <el-option
            v-for="(item, i) in cabangOptions"
            :key="i"
            :label="item.cabang"
            :value="item.id_cabang"
          />
        </el-select>
        <!-- </div> -->
        <!-- <el-select v-model="filter.sort" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select> -->
        <el-button v-waves class="filter-item" style="margin: -2px 5px 0 0" type="primary" icon="el-icon-search" @click="handleFilter">
          Cari
        </el-button>
        <el-button class="filter-item" style=" margin: -2px 5px 0 0" type="info" icon="el-icon-refresh" :disabled="!isFilter" @click="handleReset">
          Reset
        </el-button>
        <el-button v-if="role !== '1' && role !== '2'" class="filter-item" style=" margin: -2px 5px 0 0" type="success" icon="el-icon-plus" @click="handleCreate">
          Tambah
        </el-button>
        <!-- </form> -->
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin: -2px 0 0 0" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="capaian"
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
        <el-table-column label="Tanggal" :width="'150px'">
          <template slot-scope="{row}">
            <span>{{ formatTanggal(row.tanggal) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="role !== '5'" align="center" label="Service Advisor">
          <el-table-column label="Service" min-width="150px">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.sa_service) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Sparepart" min-width="150px">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.sa_sparepart) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Aksesoris" min-width="150px">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.sa_accessories) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="role !== '4'" align="center" label="Supervisor">
          <el-table-column label="Penjualan" :width="'150px'">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.sv_penjualan) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Aksesoris" :width="'150px'">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.sv_accessories) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="unit_a" :width="'150px'">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.unit_a) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="unit_b" :width="'150px'">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.unit_b) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="unit_c" :width="'150px'">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.unit_c) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Kredit" :width="'150px'">
            <template slot-scope="{row}">
              <span>{{ formatRupiah(row.kredit) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Total" :width="'150px' ">
          <template slot-scope="{row}">
            <span>{{ formatRupiah(totalKinerja(row)) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" :width="'120px' ">
          <template slot-scope="{row}">
            <el-tag :type="row.status === 0 ? 'danger' : 'success'">{{ row.status === 0 ? 'Belum Valid' : 'Valid' }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Alamat">
          <template slot-scope="{row}">
            <span>{{ row.alamat }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          v-if="role !== '6'"
          label="Actions"
          width="130px"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="{row}">
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px;">
              <!-- v-if="
                  role === '1' ||
                    role === '2' ||
                    role === '3'
                " -->
              <el-button
                v-if="role !== '4' && role !== '5'"
                type="info"
                style="margin: 0;"
                size="small"
                @click="handleEditStatus(row)"
              >Edit Status</el-button>
              <template v-if="role === '4' || role === '5'">
                <template v-if="checkDate(new Date(row.tanggal)) && (Number(row.status) !== 1)">
                  <el-button type="primary" style="margin: 0;" icon="el-icon-edit" size="small" @click="handleUpdate(row)" />
                  <el-button size="small" style="margin: 0;" icon="el-icon-delete" type="danger" @click="handleDelete(row)" />
                </template>
                <span
                  v-else
                > Tidak ada aksi </span>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="Number(totalCapaian)" :page.sync="filter.page" :limit.sync="filter.limit" @pagination="getList" />
      <!-- <pagination
        style="margin-top: 20px"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalCapaian"
        @current-change="handleCurrentChange"
      /> -->

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="60px">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" style="width: 100%;" @submit.native.prevent="dialogStatus==='create'?createData():updateData()">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="form-item" label="Tanggal" prop="tanggal">
                <el-date-picker
                  v-model="temp.tanggal"
                  type="date"
                  placeholder="Pilih Tanggal"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '5'" :md="8" :span="24">
              <el-form-item class="form-item" label="SA Service" prop="sa_service">
                <template>
                  <el-input v-model="temp.sa_service">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '5'" :md="8" :span="24">
              <el-form-item class="form-item" label="SA Sparepart" prop="sa_sparepart">
                <template>
                  <el-input v-model="temp.sa_sparepart">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '5'" :md="8" :span="24">
              <el-form-item class="form-item" label="SA Aksesoris" prop="sa_accessories">
                <template>
                  <el-input v-model="temp.sa_accessories">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '4'" :md="8" :span="24">
              <el-form-item class="form-item" label="SV Penjualan" prop="sv_penjualan">
                <template>
                  <el-input v-model="temp.sv_penjualan">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '4'" :md="8" :span="24">
              <el-form-item class="form-item" label="SV Aksesoris" prop="sv_accessories">
                <template>
                  <el-input v-model="temp.sv_accessories">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '4'" :md="8" :span="24">
              <el-form-item class="form-item" :label="'SV ' + unit_a" prop="unit_a">
                <template>
                  <el-input v-model="temp.unit_a">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '4'" :md="8" :span="24">
              <el-form-item class="form-item" :label="'SV ' + unit_b" prop="unit_b">
                <template>
                  <el-input v-model="temp.unit_b">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '4'" :md="8" :span="24">
              <el-form-item class="form-item" :label="'SV ' + unit_c" prop="unit_c">
                <template>
                  <el-input v-model="temp.unit_c">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="role !== '4'" :md="8" :span="24">
              <el-form-item class="form-item" label="SV Kredit" prop="kredit">
                <template>
                  <el-input v-model="temp.kredit">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer" style="float: right; margin-top: 10px;">
            <el-button type="info" icon="el-icon-close" @click="dialogFormVisible = false">
              Batal
            </el-button>
            <el-button type="success" icon="el-icon-check" native-type="submit">
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

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDetail" top="60px">
        <el-form ref="dataForm" :rules="dialogStatus==='create' ? rules : rules2" :model="temp" label-position="top" style="width: 100%;" @submit.native.prevent="updateStatusKinerja()">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="form-item" label="Status" prop="status">
                <template>
                  <el-select v-model="temp.status" style="width: 100%" clearable>
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
            <el-button type="info" icon="el-icon-close" @click="dialogDetail = false">
              Batal
            </el-button>
            <el-button type="success" icon="el-icon-check" native-type="submit">
              Simpan
            </el-button>
          </div>
          <div style="clear: both;" />
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { create as createCapaian, edit as editCapaian, remove as removeCapaian, editDetail, removeDetail, editStatus } from '@/api/capaian'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { id_site as site_id, unit_a, unit_b, unit_c } from '@/helpers/dataUser'
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
      total: 0,
      totalCapaian: 0,
      totalCapaianOld: 0,
      totalCapaianDetail: 0,
      listLoading: true,
      role: jsCookie.get('levelNum'),
      capaian: [],
      capaianOld: [],
      capaianDetail: {},
      counter: [],
      site_id,
      filter: {
        page: 1,
        limit: 20,
        id_cabang: '',
        bulanTahun: ''
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
        tanggal: new Date(),
        sa_service: '',
        sa_sparepart: '',
        sa_accessories: '',
        sv_penjualan: '',
        sv_accessories: '',
        unit_a: '',
        unit_b: '',
        unit_c: '',
        kredit: '',
        status: ''
      },
      temp2: [],
      dialogFormVisible: false,
      dialogDetail: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Tambah',
        detail: 'Edit Status',
        username: ''
      },
      currentPage: 1,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        tanggal: [{ required: true, message: 'tanggal is required', trigger: 'change' }],
        sa_service: [{ required: true, message: 'sa service is required', trigger: 'blur' }],
        sa_sparepart: [{ required: true, message: 'sa sparepart is required', trigger: 'blur' }],
        sa_accessories: [{ required: true, message: 'sa accessoris is required', trigger: 'blur' }],
        sv_penjualan: [{ required: true, message: 'sv penjualan is required', trigger: 'blur' }],
        sv_accessories: [{ required: true, message: 'sv accessoris is required', trigger: 'blur' }],
        unit_a: [{ required: true, message: unit_a.toLocaleLowerCase() + ' is required', trigger: 'blur' }],
        unit_b: [{ required: true, message: unit_b.toLocaleLowerCase() + ' is required', trigger: 'blur' }],
        unit_c: [{ required: true, message: unit_c.toLocaleLowerCase() + ' is required', trigger: 'blur' }],
        kredit: [{ required: true, message: 'kredit is required', trigger: 'blur' }]
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
        value: '4',
        label: 'Service Advisor'
      }, {
        value: '5',
        label: 'Supervisor'
      }, {
        value: '6',
        label: 'Kepala Cabang'
      }],
      statusOptions: [{
        value: 1,
        label: 'Valid'
      }, {
        value: 0,
        label: 'Belum Valid'
      }],
      isFirstData: true,
      cabangOptions: [],
      isLoadComboCabang: false,
      editDetail: {
        tipe: '',
        sa_service_id: '',
        sa_service: '',
        sa_sparepart_id: '',
        sa_sparepart: '',
        sa_accessoris_id: '',
        sa_accessoris: '',
        sv_penjualan_id: '',
        sv_penjualan: '',
        sv_accessoris_id: '',
        sv_accessoris: ''
      },
      editDetailStatus: {
        sa: false,
        sv: false
      },
      idCapaianDetail: '',
      isFilter: false
    }
  },
  watch: {
    'temp.tanggal': function(newVal) {
      console.log(typeof newVal)
    },
    'temp.sa_service': function(newVal) {
      if (newVal) {
        this.temp.sa_service = this.inputFormatRupiah(this.temp.sa_service)
      }
    },
    'temp.sa_sparepart': function(newVal) {
      if (newVal) {
        this.temp.sa_sparepart = this.inputFormatRupiah(this.temp.sa_sparepart)
      }
    },
    'temp.sa_accessories': function(newVal) {
      if (newVal) {
        this.temp.sa_accessories = this.inputFormatRupiah(this.temp.sa_accessories)
      }
    },
    'temp.sv_penjualan': function(newVal) {
      if (newVal) {
        this.temp.sv_penjualan = this.inputFormatRupiah(this.temp.sv_penjualan)
      }
    },
    'temp.sv_accessories': function(newVal) {
      if (newVal) {
        this.temp.sv_accessories = this.inputFormatRupiah(this.temp.sv_accessories)
      }
    },
    'temp.unit_a': function(newVal) {
      if (newVal) {
        this.temp.unit_a = this.inputFormatRupiah(this.temp.unit_a)
      }
    },
    'temp.unit_b': function(newVal) {
      if (newVal) {
        this.temp.unit_b = this.inputFormatRupiah(this.temp.unit_b)
      }
    },
    'temp.unit_c': function(newVal) {
      if (newVal) {
        this.temp.unit_c = this.inputFormatRupiah(this.temp.unit_c)
      }
    },
    'temp.kredit': function(newVal) {
      if (newVal) {
        this.temp.kredit = this.inputFormatRupiah(this.temp.kredit)
      }
    },
    'editDetail.sa_service': function(newVal) {
      this.editDetail.sa_service = this.inputFormatRupiah(this.editDetail.sa_service)
    },
    'editDetail.sa_sparepart': function(newVal) {
      this.editDetail.sa_sparepart = this.inputFormatRupiah(this.editDetail.sa_sparepart)
    },
    'editDetail.sa_accessoris': function(newVal) {
      this.editDetail.sa_accessoris = this.inputFormatRupiah(this.editDetail.sa_accessoris)
    },
    'editDetail.sv_penjualan': function(newVal) {
      this.editDetail.sv_penjualan = this.inputFormatRupiah(this.editDetail.sv_penjualan)
    },
    'editDetail.sv_accessoris': function(newVal) {
      this.editDetail.sv_accessoris = this.inputFormatRupiah(this.editDetail.sv_accessoris)
    }
  },
  created() {
    // this.listLoading = false
    this.getList()
    // this.getComboCabang()
    // setTimeout(() => {
    //   this.handleSizeChange(4)
    // }, 500)
    // console.log(new Date().)
  },
  methods: {
    getList(params) {
      this.listLoading = true
      const { page, limit, bulanTahun, id_cabang } = this.filter
      const [bulan, tahun] = !bulanTahun ? '' : bulanTahun.split('-')
      const newFilter = {
        page, limit, bulan: bulan || '', tahun: tahun || '', id_cabang
      }
      // if (this.role === '1' || this.role === '2' || this.role === '3') newFilter['id_cabang'] = id_cabang

      this.$store.dispatch('capaian/getDataCapaian', newFilter).then(response => {
        const capaian = Object.values(this.$store.getters.dataCapaian)
        const totalData = this.$store.getters.totalCapaian
        // this.$store.commit('usertv/SET_NEW_DATA_TV', usertv)
        // console.log(this.$store.getters.newDataTV);
        const { bulanTahun, id_cabang } = this.filter
        const isAllFilterNull = !bulanTahun && !id_cabang
        if (bulanTahun || id_cabang) this.isFilter = true
        if (this.isFirstData || isAllFilterNull) {
          this.capaianOld = capaian
          this.totalCapaianOld = totalData
        }
        this.capaian = capaian
        this.totalCapaian = totalData

        console.log(this.totalCapaian, this.totalCapaianOld)

        this.isFirstData = false
        // console.log(this.capaian);
        // Object.en

        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)

        this.listLoading = false
      })
    },
    getComboCabang(from, id_cabang) {
      const comboCabang = Object.values(this.$store.getters.comboCabang)
      if (comboCabang.length === 0) {
        this.isLoadComboCabang = true
        this.$store.dispatch('combo/getComboCabang', this.filter).then(response => {
          this.cabangOptions = this.$store.getters.comboCabang
          this.isLoadComboCabang = false
          if (from === 'edit') this.temp['cabang'] = id_cabang
        })
      }
      this.cabangOptions = comboCabang
      if (from === 'edit') this.temp['cabang'] = id_cabang
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      if (columns && data) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = 'TOTAL'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return this.formatRupiah(prev + curr)
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        })
      }
      return sums
    },
    handleFilter() {
      // const { nama, username, status } = this.filter
      // if (!nama && !username && !status) return
      this.filter.page = 1
      this.getList()
    },
    handleReset() {
      this.filter = {
        page: 1,
        limit: 20,
        id_cabang: '',
        bulanTahun: ''
      }
      this.capaian = this.capaianOld
      this.totalCapaian = this.totalCapaianOld
      this.isFilter = false
    },
    handleEditStatus(row) {
      this.temp['id_target'] = row.id_target
      this.temp['status'] = row.status
      this.temp['status'] = row.status
      this.temp.tanggal = row.tanggal
      this.dialogStatus = 'detail'
      this.dialogDetail = true
    },
    updateStatusKinerja() {
      const formData = new FormData()
      formData.append('id_target', this.temp.id_target)
      formData.append('tanggal', this.temp.tanggal)
      formData.append('status', this.temp.status)
      editStatus(formData)
        .then(res => {
          this.dialogDetail = false
          this.isFirstData = true
          this.getList()
          if (res.success) {
            this.notifMessage('Berhasil', 'success', res.message)
            return
          }
          this.notifMessage('Gagal', 'error', res.message)
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          this.resetTemp()
        })
    },
    handleEditDetail(data, type) {
      this.editDetail.tipe = type
      if (type === 1) {
        this.editDetailStatus.sa = true
        this.editDetail.sa_service = data.sa_service
        this.editDetail.sa_service_id = data.sa_service_id
        this.editDetail.sa_sparepart = data.sa_sparepart
        this.editDetail.sa_sparepart_id = data.sa_sparepart_id
        this.editDetail.sa_accessoris = data.sa_accessories
        this.editDetail.sa_accessoris_id = data.sa_accessories_id
      }

      if (type === 2) {
        this.editDetailStatus.sv = true
        this.editDetail.sv_penjualan = data.sv_penjualan
        this.editDetail.sv_penjualan_id = data.sv_penjualan_id
        this.editDetail.sv_accessoris = data.sv_accessories
        this.editDetail.sv_accessoris_id = data.sv_accessories_id
      }
    },
    rowClickEditDetailSA(row, column, event) {
      if (this.role === '1' || this.role === '3') this.handleEditDetail(row, 1)
    },
    rowClickEditDetailSV(row, column, event) {
      if (this.role === '1' || this.role === '3') this.handleEditDetail(row, 2)
    },
    resetTarget() {
      this.$confirm('Yakin untuk melakukan reset capaian ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        title: 'Reset Taget',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('id_target', this.idCapaianDetail)
        removeDetail(formData)
          .then(res => {
            this.getListDetail(this.idCapaianDetail)
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
    resetFormEditTarget(type) {
      this.editDetail.tipe = ''

      if (type === 1) {
        this.editDetailStatus.sa = false
        this.editDetail.sa_service = ''
        this.editDetail.sa_service_id = ''
        this.editDetail.sa_sparepart = ''
        this.editDetail.sa_sparepart_id = ''
        this.editDetail.sa_accessoris = ''
        this.editDetail.sa_accessoris_id = ''
      }

      if (type === 2) {
        this.editDetailStatus.sv = false
        this.editDetail.sv_penjualan = ''
        this.editDetail.sv_penjualan_id = ''
        this.editDetail.sv_accessoris = ''
        this.editDetail.sv_accessoris_id = ''
      }
    },
    updateTarget() {
      const temp = this.editDetail
      const formatToNumber = (value) => {
        return value.split('.').join('')
      }
      const formData = new FormData()
      formData.append('tipe', temp.tipe)
      if (temp.tipe === 1) {
        formData.append('sa_service_id', temp.sa_service_id)
        formData.append('sa_service', formatToNumber(temp.sa_service))
        formData.append('sa_sparepart_id', temp.sa_sparepart_id)
        formData.append('sa_sparepart', formatToNumber(temp.sa_sparepart))
        formData.append('sa_accessories_id', temp.sa_accessoris_id)
        formData.append('sa_accessories', formatToNumber(temp.sa_accessoris))
      }
      if (temp.tipe === 2) {
        formData.append('sv_penjualan_id', temp.sv_penjualan_id)
        formData.append('sv_penjualan', formatToNumber(temp.sv_penjualan))
        formData.append('sv_accessories_id', temp.sv_accessoris_id)
        formData.append('sv_accessories', formatToNumber(temp.sv_accessoris))
      }
      editDetail(formData)
        .then(res => {
          this.resetFormEditTarget(temp.tipe)
          if (res.success) {
            this.getListDetail(this.idCapaianDetail)
            this.notifMessage('Berhasil', 'success', res.message)
            return
          }
          this.notifMessage('Gagal', 'error', res.message)
        }).catch(error => {
          console.error(error)
        })
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
        tanggal: new Date(),
        sa_service: '',
        sa_sparepart: '',
        sa_accessoris: '',
        sv_penjualan: '',
        sv_accessoris: '',
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
          const returnZero = (value) => {
            if (value.toString().length === 1) return '0' + value

            return value
          }

          const returnDateFormat = (date) => {
            if (!(date instanceof Date)) return false

            return `${date.getFullYear()}-${returnZero(date.getMonth() + 1)}-${returnZero(date.getDate())}`
          }

          const returnTimeFormat = (date) => {
            if (!(date instanceof Date)) return false

            return `${returnZero(date.getHours())}:${returnZero(date.getMinutes())}:${returnZero(date.getSeconds())}`
          }

          console.log(returnDateFormat(temp.tanggal))
          console.log(returnTimeFormat(temp.tanggal))

          const tanggal = returnDateFormat(temp.tanggal)
          const checkDate = returnDateFormat(temp.tanggal) !== returnDateFormat(new Date())
          checkDate ? tanggal + ' ' + '00:00:00' : tanggal + ' ' + returnTimeFormat(temp.tanggal)

          const formatToNumber = (value) => {
            if (!value) return ''

            return value.split('.').join('')
          }

          const formData = new FormData()
          formData.append('id_user', this.role)
          formData.append('tanggal', checkDate ? tanggal + ' ' + '00:00:00' : tanggal + ' ' + returnTimeFormat(temp.tanggal))
          formData.append('sa_service', formatToNumber(temp.sa_service))
          formData.append('sa_sparepart', formatToNumber(temp.sa_sparepart))
          formData.append('sa_accessoris', formatToNumber(temp.sa_accessories))
          formData.append('sv_penjualan', formatToNumber(temp.sv_penjualan))
          formData.append('sv_accessoris', formatToNumber(temp.sv_accessories))
          formData.append('unit_a', formatToNumber(temp.unit_a))
          formData.append('unit_b', formatToNumber(temp.unit_b))
          formData.append('unit_c', formatToNumber(temp.unit_c))
          formData.append('kredit', formatToNumber(temp.kredit))

          this.listLoading = true

          createCapaian(formData)
            .then((res) => {
              this.dialogFormVisible = false
              this.isFirstData = true
              this.getList()
              if (res.success) {
                this.notifMessage('Berhasil', 'success', res.message)
                return
              }
              this.notifMessage('Gagal', 'error', res.message)
            })
            .finally(() => {
              this.resetTemp()
              this.listLoading = false
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp['bulanTahun'] = row.bulan + '-' + row.tahun
      // this.getComboCabang('edit', row.id_cabang)
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
          const formatToNumber = (value) => {
            if (!value) return ''

            return value.split('.').join('')
          }

          const temp = this.temp
          console.log(temp)

          const formData = new FormData()
          // formData.append('id_target', temp.id_target)
          if (this.role === '4') {
            formData.append('sa_service_id', temp.sa_service_id)
            formData.append('sa_service', formatToNumber(temp.sa_service))
            formData.append('sa_sparepart_id', temp.sa_sparepart_id)
            formData.append('sa_sparepart', formatToNumber(temp.sa_sparepart))
            formData.append('sa_accessories_id', temp.sa_accessories_id)
            formData.append('sa_accessories', formatToNumber(temp.sa_accessories))
          }
          if (this.role === '5') {
            formData.append('sv_penjualan_id', temp.sv_penjualan_id)
            formData.append('sv_penjualan', formatToNumber(temp.sv_penjualan))
            formData.append('sv_accessories_id', temp.sv_accessories_id)
            formData.append('sv_accessories', formatToNumber(temp.sv_accessories))
            formData.append('unit_a_id', formatToNumber(temp.unit_a_id))
            formData.append('unit_a', formatToNumber(temp.unit_a))
            formData.append('unit_b_id', formatToNumber(temp.unit_b_id))
            formData.append('unit_b', formatToNumber(temp.unit_b))
            formData.append('unit_c_id', formatToNumber(temp.unit_c_id))
            formData.append('unit_c', formatToNumber(temp.unit_c))
            formData.append('kredit_id', formatToNumber(temp.kredit_id))
            formData.append('kredit', formatToNumber(temp.kredit))
          }
          editCapaian(formData).then((res) => {
            this.dialogFormVisible = false
            this.isFirstData = true
            this.getList()
            if (res.success) {
              this.notifMessage('Berhasil', 'success', res.message)
              return
            }
            this.notifMessage('Gagal', 'error', res.message)
          })
          // .finally(() => {
          //   this.resetTemp()
          // })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('Yakin untuk menghapus data ini?', 'Warning', {
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        title: 'Hapus',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        if (this.role === '4') {
          formData.append('sa_service_id', row.sa_service_id)
          formData.append('sa_sparepart_id', row.sa_sparepart_id)
          formData.append('sa_accessoris_id', row.sa_accessories_id)
        }
        if (this.role === '5') {
          formData.append('sv_penjualan_id', row.sv_penjualan_id)
          formData.append('sv_accessoris_id', row.sv_accessories_id)
          formData.append('unit_a_id', row.unit_a_id)
          formData.append('unit_b_id', row.unit_b_id)
          formData.append('unit_c_id', row.unit_c_id)
          formData.append('kredit_id', row.kredit_id)
        }
        removeCapaian(formData)
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
      this.dialogDetail = true
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
      this.capaian = this.$store.getters.dataTVSlice[this.$store.getters.valCurrentChange - 1]
      this.totalCapaian = data.length
    },
    handleCurrentChange(val) {
      this.$store.commit('usertv/SET_VAL_CURENT_CHANGE', val)
      this.capaian = this.$store.getters.dataTVSlice[val - 1]
    },
    changeFilter() {
      // console.log(event.capaian.value);
      if (this.filter.username !== '') {
        this.capaian = this.$store.getters.newDataTV
        let checked = false
        this.page_sizes.forEach(value => {
          // eslint-disable-next-line eqeqeq
          if (this.capaian.length == value) {
            checked = true
          }
        })
        if (checked === true) {
          this.page_size = this.capaian.length
        } else {
          this.page_sizes.push(this.capaian.length)
          // console.log(this.page_sizes);
          this.page_size = this.capaian.length
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
    },
    formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(number)
    },
    inputFormatRupiah(value) {
      const number_string = value.replace(/[^,\d]/g, '').toString()
      const split = number_string.split(',')
      const sisa = split[0].length % 3
      let rupiah = split[0].substr(0, sisa)
      const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

      // tambahkan titik jika yang di input sudah menjadi angka ribuan
      if (ribuan) {
        const separator = sisa ? '.' : ''
        rupiah += separator + ribuan.join('.')
      }

      rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
      return rupiah
    },
    formatTanggal(tanggal) {
      if (!tanggal) return
      if (typeof tanggal === 'object') {
        const addZero = (value) => {
          return value.length === 1 ? '0' + value : value
        }
        return `${tanggal.getFullYear()}-${addZero(String(tanggal.getMonth() + 1))}-${addZero(String(tanggal.getDate()))}`
      }
      const split = tanggal.split('-')
      const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      return `${split[2]} ${bulan[Number(split[1]) - 1]} ${split[0]}`
    },
    totalKinerja(data) {
      let total = 0
      if (this.role !== '5') {
        total += Number(data.sa_service)
        total += Number(data.sa_sparepart)
        total += Number(data.sa_accessories)
      }
      if (this.role !== '4') {
        total += Number(data.sv_penjualan)
        total += Number(data.sv_accessories)
        total += Number(data.unit_a)
        total += Number(data.unit_b)
        total += Number(data.unit_c)
        total += Number(data.kredit)
      }

      return total
    },
    checkDate(dateSet) {
      const date = new Date()
      const newDate = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
      dateSet.setHours(0)
      dateSet.setMinutes(0)
      dateSet.setSeconds(0)
      newDate.setHours(0)
      newDate.setMinutes(0)
      newDate.setSeconds(0)

      return dateSet.getTime() >= newDate.getTime()
    }
  }
}
</script>

<style lang="scss">
  .form-item .el-form-item__label{
    padding: 0 !important;
  }
  .column-sa {
    width: 150px !important;
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
