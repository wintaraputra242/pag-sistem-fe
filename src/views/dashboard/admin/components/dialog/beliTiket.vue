<template>
  <el-dialog top="35px" width="95vw" :visible="visibility" @close="handleClose" @open="handleOpen">
    <div slot="title">
      <div style="font-size: 24px;font-weight: 600;">{{ 'Beli Tiket' }}</div>
    </div>
    <el-row :gutter="20">
      <el-col :xl="19" :md="18">
        <el-row :gutter="0" class="panel-group" style="overflow: auto; max-height: 70vh;" align="">
          <!-- make this as component  (to do) -->
          <div v-for="(value, i) in listPaket" :key="i" class="" style="">
            <div class="" @click="selectPaketCard(i, value)">
              <el-card
                class="paket-card"
                :class="[`paket-card-${i}`, value.isRecomend > 0 ? 'recommended' : '',]"
                :body-style="selectedPaket === i ? SelectedPaketCardStyle : PaketCardStyle"
              >
                <div slot="header" class="clearfix header-paket">
                  <div style="font-size: 24px; text-align: center;">{{ value.paket }}</div>
                </div>
                <div class="card-body-paket">
                  <div v-if="value.poin > 0" class="isi-paket">{{ `${formatRibuan(value.poin)} Tiket` || '-' }}</div>
                  <div v-if="value.hari_expired > 0" class="isi-paket">{{ `Masa Aktif ${value.hari_expired} hari` || '-' }}</div>
                  <p class="isi-paket" style="word-break: keep-all;">{{ value.deskripsi || '-' }}</p>
                  <hr style="margin: 24px -20px">
                  <div v-if="i === Object.keys(listPaket).length - 1" class="harga-paket">{{ `Kontak: ${value.harga}` }}</div>
                  <div v-else-if="value.status_diskon === 1" class="harga-paket">
                    <div class="harga-diskon" style="display: inline;margin: 0; padding: 0;">
                      <div style="text-decoration: line-through;transform: rotate(-8deg); font-size: 12px; text-align: start;width: 100px;margin-top: calc(-5%); margin-bottom: calc(-2%);">{{ `${formatRupiah1(value.harga)}` }}
                      </div>
                      {{ `${formatRupiah1(value.harga_diskon)}` }}
                      <el-tag type="danger" effect="dark" style="border-radius: 50px; font-size: 12px;">{{ `Diskon ${value.persen_diskon}` }}</el-tag>
                    </div>
                  </div>
                  <div v-else class="harga-paket">{{ `${formatRupiah1(value.harga)}` }}</div>
                </div>
              </el-card>
            </div>
          </div>

        </el-row>
      </el-col>
      <el-col :xl="5" :md="6">
        <div class="check-out">
          <h1>Pesanan</h1>
          <div v-if="tempSelectedPaket.spesial === 1" class="prio">
            <p>{{ `Silahkan hubungi kontak : ${tempSelectedPaket.harga}` }}</p>
          </div>
          <div v-if="tempSelectedPaket.spesial === 0" class="not-prio">
            <div class="remaining">
              <h3>Paket saat ini</h3>
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Tiket</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ formatRibuan(accountData.poin_sisa) || '-' }}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Expired</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ accountData.expired || '-' }}</div></el-col>
              </el-row>
            </div>
            <div v-if="tempSelectedPaket.paket" class="selected-package">
              <h3>{{ tempSelectedPaket.paket }}</h3>
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Tiket</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ `+ ${formatRibuan(tempSelectedPaket.poin)}` }}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Expired</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ `+ ${tempSelectedPaket.hari_expired} Hari` }}</div></el-col>
              </el-row>
            </div>
            <div class="calculation">
              <h3>Jumlah Kalkulasi </h3>
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Tiket</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ formatRibuan(accountData.poin_sisa + tempSelectedPaket.poin) }}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Expired</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ addDays(accountData.expired, tempSelectedPaket.hari_expired) }}</div></el-col>
              </el-row>
            </div>
            <hr>
            <div class="">
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Harga</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ formatRupiah1(tempSelectedPaket.harga_diskon > 0 ? tempSelectedPaket.harga_diskon : tempSelectedPaket.harga) }}</div></el-col>
              </el-row>
              <!-- <el-row :gutter="20">
                  <el-col :span="12"><div class="grid-content bg-purple">PPN</div></el-col>
                  <el-col :span="12"><div class="grid-content bg-purple">{{ ((tempSelectedPaket.harga_diskon > 0 ? tempSelectedPaket.harga_diskon : tempSelectedPaket.harga) * 0.1) * 1 }}</div></el-col>
                </el-row> -->
              <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content bg-purple">Total Tagihan</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple">{{ formatRupiah1(tempSelectedPaket.total_tagihan) }}</div></el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button plain @click="handleClose">
        Cancel
      </el-button>
      <el-button
        type="success"
        style="width: 200px;"
        :style="{'background-color': tempSelectedPaket.paketId === '000' || tempSelectedPaket.paketId === '100' ? 'rgba(0, 137, 123, .5)' : 'rgba(0, 137, 123, 1)' }"
        :disabled="tempSelectedPaket.paketId === '100' || tempSelectedPaket.paketId === '000'"
        @click="handleKonfirmasiPembayaran"
      >
        Check Out
      </el-button>
    </div>

    <el-dialog
      width="30%"
      :visible.sync="dialogKonfirmasiCheckout"
      append-to-body
    >
      <div slot="title">
        <div style="font-size: 24px;font-weight: 600;">{{ 'Konfirmasi Pembayaran' }}</div>
      </div>
      <div class="confirm-pesanan">
        <p>Nama : <b>{{ nama_site }}</b></p>
        <p>Paket : <b>{{ tempSelectedPaket.paket }}</b></p>
        <p>Total Tagihan : <b>{{ formatRupiah1(tempSelectedPaket.total_tagihan) }}</b></p>
        <p style="word-break: keep-all;">Dengan ini anda menyetujui pembelian paket. Invoice akan dikirim via email. Total invoice akan ditambahkan dengan 3 digit kode uniq untuk mempermudah proses pengecekan</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button plain @click="dialogKonfirmasiCheckout = false">
            Close
          </el-button> -->
        <el-button type="success" :loading="beliLoading" style="width: 200px;background-color: rgba(0, 137, 123, 1);" @click="beliPaket()">
          Proses
        </el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { id_site as site_id, nama_site, email_site } from '@/helpers/dataUser'

const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  }).format(number)
}
const ribuan = (val) => {
  if (val === '') { val = 0 } else if (typeof val === 'string') { Number(val) } else if (typeof val !== 'number' || Number.isNaN(val)) { val = 0 }

  const result = val.toString().split('').reverse().join('')
    .match(/\d{1,3}/g)
    .join('.').split('').reverse().join('')
  return result
}

export default {
  props: {
    visibility: {
      type: Boolean
    }
  },
  data() {
    return {
      site_id,
      nama_site,
      email_site,
      beliLoading: false,
      listPaket: null,
      selectedPaket: null,
      dialogKonfirmasiCheckout: false,
      tempSelectedPaket: {
        paketId: '000',
        paket: '',
        harga: 0,
        harga_diskon: 0,
        poin: 0,
        hari_expired: 0,
        spesial: 0,
        total_tagihan: 0
      },
      PaketCardStyle: { 'background-color': '#fff', 'font-weight': '400', 'font-size': '14px', 'height': '200px' },
      SelectedPaketCardStyle: { 'background-color': 'rgb(20 184 166)', 'font-weight': '100', 'font-size': '14px', 'height': '200px' }
    }
  },
  computed: {
    accountData() {
      return this.$store.getters.accountData
    },
    months() {
      return {
        'Januari': 1,
        'Februari': 2,
        'Maret': 3,
        'April': 4,
        'Mei': 5,
        'Juni': 6,
        'Juli': 7,
        'Agustus': 8,
        'September': 9,
        'Oktober': 10,
        'November': 11,
        'Desember': 12
      }
    }
  },
  watch: {
    'tempSelectedPaket.harga'() {
      this.tempSelectedPaket.total_tagihan = this.tempSelectedPaket.harga_diskon > 0 ? this.tempSelectedPaket.harga_diskon : this.tempSelectedPaket.harga
    }
  },
  methods: {
    handleOpen() {
      console.log(this.$store.getters.accountData)
      this.$store.dispatch('dashboard/getListPackage')
        .then(res => {
          this.listPaket = res.data_paket
        }).catch(err => {
          const text_err = err?.message ?? 'Something Went Wrong'
          this.$message.error(text_err === '' ? 'Something Went Wrong' : text_err)
        })
    },
    handleClose() {
      this.$emit('closeDialog')
      /**
         * Loop through all radio cards, and remove the class "isSelected" from those elements.
         */
      const allRadioCards = document.querySelectorAll('.paket-card')
      allRadioCards.forEach((element, index) => {
        element.classList.remove(['isSelected'])
      })
      this.selectedPaket = null
      this.resetSelectedPaketTemp()
      this.beliLoading = false
    },
    handleKonfirmasiPembayaran() {
      this.dialogKonfirmasiCheckout = true
    },
    selectPaketCard(cardNo, cardVal) {
      /**
       * Loop through all radio cards, and remove the class "isSelected" from those elements.
       */
      const allRadioCards = document.querySelectorAll('.paket-card')
      allRadioCards.forEach((element, index) => {
        element.classList.remove(['isSelected'])
      })
      /**
       * Add the class "isSelected" to the card which user has clicked on.
       */
      const selectedCard = document.querySelector('.paket-card-' + cardNo)
      selectedCard.classList.add(['isSelected'])

      this.selectedPaket = cardNo
      this.tempSelectedPaket = cardVal
    },
    resetSelectedPaketTemp() {
      this.tempSelectedPaket = {
        paketId: '000',
        paket: '',
        harga: 0,
        harga_diskon: 0,
        poin: 0,
        hari_expired: 0,
        spesial: 0,
        total_tagihan: 0
      }
    },
    addDays(date, days) {
      date = String(date)
      const [day, month, year] = date.split(' ')
      const newDate = new Date(`${year}-${this.months[month]}-${day}`)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      newDate.setDate(newDate.getDate() + days)
      const result = newDate.toLocaleString(['ban', 'id'], options)
      return result
    },
    formatRupiah1(num) {
      return rupiah(Number(num))
    },
    formatRibuan(num = 0) {
      return ribuan(num)
    },
    beliPaket() {
      this.beliLoading = true

      this.$store.dispatch('dashboard/buyingPackage', this.tempSelectedPaket)
        .then(res => {
          if (res.success === true) {
            this.$alert(res.message, 'Pesanan Anda Berhasil Diproses', {
              confirmButtonText: 'OK',
              roundButton: true,
              type: 'success'
            })
            this.dialogKonfirmasiCheckout = false
            this.handleClose()
          } else {
            throw res
          }
        }).catch(err => {
          console.error(err)
          // handle timeout (todo) pesanan dibuat tapi api timeout
          this.$alert(err.message, 'Pesanan Anda Gagal Diproses', {
            confirmButtonText: 'OK',
            roundButton: true,
            type: 'error'
          })
        }).finally(() => {
          this.beliLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.recommended:before {
  content: "";
  z-index: -1;
  overflow: hidden;
  transform: rotate(-135deg);
  width: 120px;
  display: block;
  background: #00897B;
  background: linear-gradient(#26A69A 0%, #00897B 100%);
  box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  position: absolute;
  top: 34px;
  right: -16px;
  clip-path: polygon(120px 20px, 90px -10px, 30px -10px, 0px 20px, 10px 30px,  110px 30px);
  height: 20px;
  width: 120px;
}
.recommended:after {
  content: "recommended";
  letter-spacing: 1.1px;
  z-index: 1;
  overflow: hidden;
  font-size: 9.5px;
  padding: 2px 5px;
  font-weight: bold;
  color: #FFF;
  text-transform: uppercase;
  text-align: center;
  line-height: 20px;
  transform: rotate(45deg);
  width: 125px;
  display: block;
  background: #00897B;
  background: linear-gradient(#2eb1a4 0%, #018073 100%);
  box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  position: absolute;
  top: 25px; right: -28px;
  clip-path: polygon(125px 20px, 90px -10px, 30px -10px, 0px 20px, 10px 30px,  110px 30px)
}
.el-message-box__wrapper {
  border-radius: 25px;
}
.check-out {
  border: 2px solid rgb(190, 190, 190);
  border-radius: 15px;
  padding: 5px 20px 20px 20px;
  margin: 20px 0;
  word-break: keep-all;
}

.panel-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .paket-card {
    position: relative;
    width: 300px;
    margin: 1vw;
    border-radius: 15px;
    cursor: pointer;
    background-color: rgba(0, 150, 132, 0.833);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    letter-spacing: 1px;
    font-weight: 900;
    line-height: 20px;
    .header-paket {
      color: white !important;

    }
  }

  .isSelected {
    // border: 2px solid #00897B;
    background-color: #00897B !important;
    color: rgb(255, 255, 255) !important;

    .header-paket {
    }
  }
  .card-body-paket{
    height: 100%;
    text-align: center;
    font-weight: normal;
  }

  .isi-paket{
    margin: 8px 0;
  }

  .harga-paket {
    font-weight: 600;
  }

}
</style>
