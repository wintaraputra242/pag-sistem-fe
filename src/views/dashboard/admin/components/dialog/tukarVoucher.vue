<template>
  <el-dialog center :visible="visibility" width="550px" @close="handleClose">
    <div slot="title">
      <div class="title">{{ 'Tukar Voucher' }}</div>
    </div>
    <div style="text-align: center;">Masukkan kode yang anda miliki. Pastikan kode masih aktif dan belum digunakan.</div>
    <div slot="footer">
      <el-form :inline="true" :model="voucher" style="text-align: center; width: 100%;">
        <el-form-item label="Kode Voucher">
          <el-input v-model="voucher.kode" placeholder="XX XX XX" />
        </el-form-item>
        <el-button type="primary" @click="handleKonfirmasiVoucher">Tukar</el-button>
      </el-form>
    </div>
    <el-dialog
      width="30%"
      :visible.sync="dialogKonfirmasiVoucher"
      append-to-body
      center
    >
      <div slot="title">
        <div class="title">{{ 'Konfirmasi Tukar Voucher' }}</div>
        <hr style="margin-top:24px">
      </div>
      <div class="confirm-voucher" style="text-align: center; margin-top: -5%;">
        <h2>Kode Voucher Anda Valid Dengan Detail  :</h2>
        <p>Jumlah Tiket : <b>{{ (voucher.tiket) | formatRibuan }}</b></p>
        <p>Masa Aktif : <b>{{ voucher.hari }}</b> </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogKonfirmasiVoucher = false">
          Cancel
        </el-button>
        <el-button type="primary" style="width: 200px;" @click="redeem">
          Gunakan
        </el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { id_site as site_id } from '@/helpers/dataUser'

export default {
  filters: {
    formatRibuan(val) {
      if (val === '') { val = 0 } else if (typeof val === 'string') { Number(val) } else if (typeof val !== 'number' || Number.isNaN(val)) { val = 0 }

      const result = val.toString().split('').reverse().join('')
        .match(/\d{1,3}/g)
        .join('.').split('').reverse().join('')
      return result
    }
  },
  props: {
    visibility: {
      type: Boolean
    }
  },
  data() {
    return {
      site_id,
      dialogKonfirmasiVoucher: false,
      voucher: {
        kode: '',
        tiket: 0,
        hari: '',
        expired: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog')
      this.resetTemp()
    },
    resetTemp() {
      this.voucher = {
        kode: '',
        tiket: 0,
        hari: '',
        expired: ''
      }
    },
    handleKonfirmasiVoucher() {
      this.$store.dispatch('dashboard/confirmVoucher', this.voucher)
        .then(res => {
          if (res.success === true) {
            this.voucher.tiket = res.data.tiket
            this.voucher.hari = res.data.hari
            this.dialogKonfirmasiVoucher = true
          } else {
            throw res
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    redeem() {
      this.$store.dispatch('dashboard/useVoucher', this.voucher)
        .then(res => {
          if (res.success === true) {
            this.$notify({
              title: 'Success',
              message: 'Voucher Berhasil Digunakan!',
              type: 'success'
            })
            this.$store.dispatch('dashboard/AccountInfo')
              .catch(err => {
                const text_err = err?.message ?? 'Something Went Wrong'
                this.$message.error(text_err)
              })
          } else {
            throw res
          }
        }).catch(err => {
          this.$notify.error({
            title: 'Error',
            message: err?.message ?? 'Error'
          })
          console.error(err)
        }).finally(() => {
          this.dialogKonfirmasiVoucher = false
          this.resetTemp()
          this.$emit('closeDialog')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: 600;
}
</style>
