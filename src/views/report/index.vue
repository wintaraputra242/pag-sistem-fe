<template>
  <div class="dashboard-editor-container">
    <h1 style="text-align: center; font-family: Poppins; font-weight: 600;">REPORT</h1>
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
        <el-select v-if="role === '1' || role === '2' || role === '3'" v-model="filter.id_cabang" placeholder="Pilih Cabang" style="margin: 3px 10px 10px 0" clearable :loading="isLoadComboCabang" @focus="getComboCabang">
          <el-option
            v-for="(item, i) in cabangOptions"
            :key="i"
            :label="item.cabang"
            :value="item.id_cabang"
          />
        </el-select>
        <!-- <el-select v-model="filter.status" placeholder="Pilih Status" style="margin: 3px 10px 10px 0" clearable>
          <el-option
            v-for="(item, i) in statusOptions"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
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
        <!-- <el-button class="filter-item" style=" margin: -2px 5px 0 0" type="success" icon="el-icon-plus" @click="handleCreate">
          Tambah
        </el-button> -->
        <!-- </form> -->
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin: -2px 0 0 0" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="report"
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
        <el-table-column v-if="role === '1' || role === '2' || role === '3'" label="Cabang">
          <template slot-scope="{row}">
            <span>{{ row.cabang }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="role === '1' || role === '2' || role === '3'" label="KPI">
          <template slot-scope="{row}">
            <span>{{ row.kpi }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="role !== '5'" align="center" label="Service Advisor">
          <el-table-column align="center" label="Service">
            <el-table-column label="Target" :width="role !== '4' ? '150px' : ''">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_sa_service) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="role !== '4' ? '150px' : ''">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sa_service) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="Sparepart">
            <el-table-column label="Target" :width="role !== '4' ? '150px' : ''">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_sa_sparepart) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="role !== '4' ? '150px' : ''">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sa_sparepart) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="Aksesoris">
            <el-table-column label="Target" :width="role !== '4' ? '150px' : ''">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_sa_accessoris) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="role !== '4' ? '150px' : ''">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sa_accessoris) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="role !== '4'" align="center" label="Supervisor">
          <el-table-column align="center" label="Penjualan">
            <el-table-column label="Target" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_sv_penjualan) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sv_penjualan) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="Aksesoris">
            <el-table-column label="Target" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_sv_accessoris) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sv_accessoris) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="unit_a">
            <el-table-column label="Target" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_unit_a) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sv_unit_a) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="unit_b">
            <el-table-column label="Target" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_unit_b) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sv_unit_b) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="unit_c">
            <el-table-column label="Target" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_unit_c) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sv_unit_c) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="Kredit">
            <el-table-column label="Target" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.target_kredit) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Capaian" :width="'150px'">
              <template slot-scope="{row}">
                <span>{{ formatRupiah(row.capaian_sv_kredit) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column label="Alamat">
          <template slot-scope="{row}">
            <span>{{ row.alamat }}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="Actions" width="165px" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row}">
            <el-dropdown size="small" type="primary">
              <el-button type="primary">
                Detail <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="role !== '4' || role !== '5'"><div @click="getDetails('cabang', row.id_target)">Cabang</div></el-dropdown-item>
                <el-dropdown-item v-if="role !== '5'"><div @click="getDetails('sa', row.id_target)">SA</div></el-dropdown-item>
                <el-dropdown-item v-if="role !== '4'"><div @click="getDetails('sv', row.id_target)">SV</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="Number(totalReport)" :page.sync="filter.page" :limit.sync="filter.limit" @pagination="getList" />
      <!-- <pagination
        style="margin-top: 20px"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalReport"
        @current-change="handleCurrentChange"
      /> -->

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="60px">
        <el-form ref="dataForm" :rules="dialogStatus==='create' ? rules : rules2" :model="temp" label-position="top" style="width: 100%;" @submit.native.prevent="dialogStatus==='create'?createData():updateData()">
          <el-row :gutter="20">
            <el-col :md="12" :span="24">
              <el-form-item class="form-item" label="Bulan & Tahun" prop="bulanTahun">
                <el-date-picker
                  v-model="temp.bulanTahun"
                  type="month"
                  placeholder="Pilih Bulan"
                  value-format="MM-yyyy"
                  format="MM-yyyy"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :span="24">
              <el-form-item class="form-item" label="Cabang" prop="cabang">
                <template>
                  <el-select v-model="temp.cabang" placeholder="Pilih" style="width: 100%" clearable @focus="getComboCabang">
                    <el-option
                      v-for="(item, i) in cabangOptions"
                      :key="i"
                      :label="item.cabang"
                      :value="item.id_cabang"
                    />
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="8" :span="24">
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
            <el-col :md="8" :span="24">
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
            <el-col :md="8" :span="24">
              <el-form-item class="form-item" label="SA Aksesoris" prop="sa_accessoris">
                <template>
                  <el-input v-model="temp.sa_accessoris">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col :md="12" :span="24">
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
            <el-col :md="12" :span="24">
              <el-form-item class="form-item" label="SV Aksesoris" prop="sv_accessoris">
                <template>
                  <el-input v-model="temp.sv_accessoris">
                    <template slot="prefix">
                      <span>Rp.</span>
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="24">
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

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDetail" top="40px" width="60rem">
        <!-- <el-select v-if="role === '1' || role === '2' || role === '3'" v-model="comboUserDetail" style="margin: 3px 10px 10px 0" clearable>
          <el-option
            v-for="(item, i) in cabangOptions"
            :key="i"
            :label="item.cabang"
            :value="item.id_cabang"
          />
        </el-select> -->
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="reportDetail"
          highlight-current-row
          max-height="30rem"
          border
          stripe
          style="width: 100%; border-radius: 6px; overflow: auto;"
          @row-dblclick="rowClickEditDetailSA"
        >
          <el-table-column
            prop="0"
            label="Tanggal"
            min-width="150px"
          >
            <template slot-scope="{row}">
              <span>{{ formatTanggal(row.tanggal) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="dialogStatus !== 'detail_sv'" align="center" label="Service Advisor">
            <el-table-column align="center" label="Service">
              <el-table-column label="Target" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_sa_service) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_sa_service) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_sa_service ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_sa_service ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="Sparepart">
              <el-table-column label="Target" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_sa_sparepart) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_sa_sparepart) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_sa_sparepart ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_sa_sparepart ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="Aksesoris">
              <el-table-column label="Target" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_sa_accessoris) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_sa_accessoris) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_sa_accessoris ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_sa_accessoris ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column v-if="dialogStatus !== 'detail_sa'" align="center" label="Supervisor">
            <el-table-column align="center" label="Penjualan">
              <el-table-column label="Target" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_sv_penjualan) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_sv_penjualan) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_sv_penjualan ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_sv_penjualan ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="Aksesoris">
              <el-table-column label="Target" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_sv_accessoris) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_sv_accessoris) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_sv_accessoris ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_sv_accessoris ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="unit_a">
              <el-table-column label="Target" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_unit_a) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_unit_a) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_unit_a ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_unit_a ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="unit_b">
              <el-table-column label="Target" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_unit_b) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_unit_b) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_unit_b ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_unit_b ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="unit_c">
              <el-table-column label="Target" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_unit_c) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_unit_c) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_unit_c ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_unit_c ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="Kredit">
              <el-table-column label="Target" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.target_kredit) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Capaian" :width="'150px'">
                <template slot-scope="{row}">
                  <span>{{ formatRupiah(row.capaian_kredit) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" :width="role !== '4' ? '150px' : ''">
                <template slot-scope="{row}">
                  <span
                    :style="{
                      color: !row.status_kredit ? 'red' : 'green',
                      fontWeight: 'bold'
                    }"
                  >{{ !row.status_kredit ? 'Belum Tercapai' : 'Tercapai' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDetail = false">
            Close
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { create as createTarget, edit as editTarget, remove as removeTarget, editDetail, removeDetail } from '@/api/report'
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
      totalReport: 0,
      totalReportOld: 0,
      totalTargetDetail: 0,
      listLoading: true,
      role: jsCookie.get('levelNum'),
      report: [],
      reportOld: [],
      targetDetail: {},
      counter: [],
      site_id,
      filter: {
        page: 1,
        limit: 20,
        id_cabang: '',
        bulanTahun: '',
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
        cabang: '',
        sa_service: '',
        sa_sparepart: '',
        sa_accessoris: '',
        sv_penjualan: '',
        sv_accessoris: '',
        status: ''
      },
      temp2: [],
      dialogFormVisible: false,
      dialogDetail: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Tambah',
        detail_cabang: 'Detail Cabang',
        detail_sa: 'Detail SA',
        detail_sv: 'Detail SV',
        username: ''
      },
      currentPage: 1,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        bulanTahun: [{ required: true, message: 'bulan is required', trigger: 'blur' }],
        cabang: [{ required: true, message: 'cabang is required', trigger: 'change' }],
        sa_service: [{ required: true, message: 'sa service is required', trigger: 'blur' }],
        sa_sparepart: [{ required: true, message: 'sa sparepart is required', trigger: 'blur' }],
        sa_accessoris: [{ required: true, message: 'sa accessoris is required', trigger: 'blur' }],
        sv_penjualan: [{ required: true, message: 'sv penjualan is required', trigger: 'blur' }],
        sv_accessoris: [{ required: true, message: 'sv accessoris is required', trigger: 'blur' }],
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
        value: '1',
        label: 'Group'
      }, {
        value: '2',
        label: 'Split'
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
      idTargetDetail: '',
      isFilter: '',
      reportDetail: []
    }
  },
  watch: {
    'temp.sa_service': function(newVal) {
      this.temp.sa_service = this.inputFormatRupiah(this.temp.sa_service)
    },
    'temp.sa_sparepart': function(newVal) {
      this.temp.sa_sparepart = this.inputFormatRupiah(this.temp.sa_sparepart)
    },
    'temp.sa_accessoris': function(newVal) {
      this.temp.sa_accessoris = this.inputFormatRupiah(this.temp.sa_accessoris)
    },
    'temp.sv_penjualan': function(newVal) {
      this.temp.sv_penjualan = this.inputFormatRupiah(this.temp.sv_penjualan)
    },
    'temp.sv_accessoris': function(newVal) {
      this.temp.sv_accessoris = this.inputFormatRupiah(this.temp.sv_accessoris)
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
  },
  methods: {
    getList(params) {
      this.listLoading = true
      const { page, limit, id_cabang, bulanTahun } = this.filter
      const [bulan, tahun] = !bulanTahun ? '' : bulanTahun.split('-')
      const newFilter = {
        page, limit, id_cabang, bulan: bulan || '', tahun: tahun || ''
      }
      this.$store.dispatch('report/getDataReport', newFilter).then(response => {
        const report = Object.values(this.$store.getters.dataReport)
        const totalData = this.$store.getters.totalReport
        // this.$store.commit('usertv/SET_NEW_DATA_TV', usertv)
        // console.log(this.$store.getters.newDataTV);
        const { bulanTahun, id_cabang } = this.filter
        const isAllFilterNull = !bulanTahun && !id_cabang
        if (bulanTahun || id_cabang) this.isFilter = true
        if (this.isFirstData || isAllFilterNull) {
          this.reportOld = report
          this.totalReportOld = totalData
        }
        this.report = report
        this.totalReport = totalData

        console.log(this.totalReport, this.totalReportOld)

        this.isFirstData = false
        // console.log(this.report);
        // Object.en

        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)

        this.listLoading = false
      })
    },
    getDetails(type, id) {
      this.dialogDetail = true
      this.dialogStatus = 'detail_' + type
      this.$store.dispatch('report/getDetail', { type, id_target: id }).then(response => {
        let report

        if (type === 'cabang') report = this.$store.getters.dataReportDetailCabang
        if (type === 'sa') report = this.$store.getters.dataReportDetailSA
        if (type === 'sv') report = this.$store.getters.dataReportDetailSV
        // const totalData = this.$store.getters.totalDetailTarget

        console.log(report)
        this.reportDetail = report

        // const createNewArray = data => {
        //   const entries = Object.entries(data)
        //   const newData = entries.filter(val => {
        //     return /[0-9]/g.test(val[0])
        //   }).map(val => val[1])
        //   return newData
        // }
        // createNewArray(report.data_sa)
        // this.targetDetail = {
        //   data_sa: report.data_sa[0] ? createNewArray(report.data_sa) : [],
        //   data_sv: report.data_sv[0] ? createNewArray(report.data_sv) : []
        // }
        // console.log(this.targetDetail)
        // this.totalTargetDetail = totalData

        // console.log(this.targetDetail)
        // console.log(this.totalTargetDetail)
      })
    },
    getListDetail(id) {
      this.$store.dispatch('report/getDataTargetDetail', { id_target: id }).then(response => {
        const report = this.$store.getters.dataDetailTarget
        const totalData = this.$store.getters.totalDetailTarget
        const createNewArray = data => {
          const entries = Object.entries(data)
          const newData = entries.filter(val => {
            return /[0-9]/g.test(val[0])
          }).map(val => val[1])
          return newData
        }
        createNewArray(report.data_sa)
        this.targetDetail = {
          data_sa: report.data_sa[0] ? createNewArray(report.data_sa) : [],
          data_sv: report.data_sv[0] ? createNewArray(report.data_sv) : []
        }
        console.log(this.targetDetail)
        this.totalTargetDetail = totalData

        // console.log(this.targetDetail)
        // console.log(this.totalTargetDetail)
      })
    },
    getComboCabang(from, id_cabang) {
      const comboCabang = Object.values(this.$store.getters.comboCabang)
      if (comboCabang.length === 0) {
        this.isLoadComboCabang = true
        this.$store.dispatch('combo/getComboCabang', { cabang: '', status: '' }).then(response => {
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
        nama: '',
        username: '',
        status: '',
        id_level: '',
        id_cabang: ''
      }
      this.report = this.reportOld
      this.totalReport = this.totalReportOld
      this.isFilter = false
    },
    handleDetail(id) {
      this.idTargetDetail = id
      this.dialogStatus = 'detail'
      this.dialogDetail = true
      this.getListDetail(id)
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
      this.$confirm('Yakin untuk melakukan reset report ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        title: 'Reset Taget',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('id_target', this.idTargetDetail)
        removeDetail(formData)
          .then(res => {
            this.getListDetail(this.idTargetDetail)
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
            this.getListDetail(this.idTargetDetail)
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
        site: this.site_id,
        username: '',
        password: '',
        nama: '',
        alamat: '',
        hp: '',
        level: '',
        status: '',
        cabang: ''
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
          const [bulan, tahun] = temp.bulanTahun.split('-')
          const formatToNumber = (value) => {
            return value.split('.').join('')
          }

          const formData = new FormData()
          formData.append('bulan', bulan)
          formData.append('tahun', tahun)
          formData.append('id_cabang', temp.cabang)
          formData.append('sa_service', formatToNumber(temp.sa_service))
          formData.append('sa_sparepart', formatToNumber(temp.sa_sparepart))
          formData.append('sa_accessoris', formatToNumber(temp.sa_accessoris))
          formData.append('sv_penjualan', formatToNumber(temp.sv_penjualan))
          formData.append('sv_accessoris', formatToNumber(temp.sv_accessoris))
          formData.append('status', temp.status)
          createTarget(formData)
            .then((res) => {
              this.dialogFormVisible = false
              this.listLoading = true
              this.isFirstData = true
              this.handleReset()
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
      this.temp['bulanTahun'] = row.bulan + '-' + row.tahun
      this.temp['status'] = row.id_status
      this.getComboCabang('edit', row.id_cabang)
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
          const temp = this.temp
          const [bulan, tahun] = temp.bulanTahun.split('-')
          const formatToNumber = (value) => {
            return value.split('.').join('')
          }
          const formData = new FormData()
          formData.append('id_target', temp.id_target)
          formData.append('bulan', bulan)
          formData.append('tahun', tahun)
          formData.append('id_cabang', temp.cabang)
          formData.append('sa_service', formatToNumber(temp.sa_service))
          formData.append('sa_sparepart', formatToNumber(temp.sa_sparepart))
          formData.append('sa_accessoris', formatToNumber(temp.sa_accessoris))
          formData.append('sv_penjualan', formatToNumber(temp.sv_penjualan))
          formData.append('sv_accessoris', formatToNumber(temp.sv_accessoris))
          formData.append('status', temp.status)
          editTarget(formData).then((res) => {
            this.dialogFormVisible = false
            this.listLoading = true
            this.isFirstData = true
            this.handleReset()
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
    handleDelete(id, cabang) {
      this.$confirm('Yakin untuk menghapus data ini?', 'Warning', {
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        title: 'Hapus',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('cabang', cabang)
        formData.append('id_target', id)
        removeTarget(formData)
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
      this.report = this.$store.getters.dataTVSlice[this.$store.getters.valCurrentChange - 1]
      this.totalReport = data.length
    },
    handleCurrentChange(val) {
      this.$store.commit('usertv/SET_VAL_CURENT_CHANGE', val)
      this.report = this.$store.getters.dataTVSlice[val - 1]
    },
    changeFilter() {
      // console.log(event.report.value);
      if (this.filter.username !== '') {
        this.report = this.$store.getters.newDataTV
        let checked = false
        this.page_sizes.forEach(value => {
          // eslint-disable-next-line eqeqeq
          if (this.report.length == value) {
            checked = true
          }
        })
        if (checked === true) {
          this.page_size = this.report.length
        } else {
          this.page_sizes.push(this.report.length)
          // console.log(this.page_sizes);
          this.page_size = this.report.length
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
