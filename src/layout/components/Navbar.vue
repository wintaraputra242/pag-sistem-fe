<template>
  <div class="navbar" :style="`${counterPage ? 'display: flex; justify-content: space-between; background: #304156; position: fixed; z-index: 999; width: 100%' : 'position: relative'}`">
    <hamburger v-if="notCounterPage" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <template v-if="notCounterPage">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </template>
    <template v-else>
      <img src="https://clientq.isn-speed.com/img/logo.ccdebe47.png" alt="" width="45" height="45" style="margin: 10px 0 0 10px">
    </template>

    <h2 v-if="counterPage" class="navbar-title" style="color: white; margin-top: 15px;">{{ user.nama }} - {{ user.person }}</h2>

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template> -->

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper" :style=" counterPage ? 'color: white;' : ''">
          <!-- <span style="margin-right: 5px; font-size: 16px;"><b>{{ `Hi ${username}` }} </b> {{ `(Tahun ${tahun})` }}</span> -->
          <i class="el-icon-caret-bottom user-avatar" />
          <i class="el-icon-user-solid user-avatar" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <span class="profile-name">{{ user.nama }}</span>
          <!-- <el-dropdown-item @click.native="handleProfile">
            <span style="display:block;"><i class="el-icon-user" /> Profile</span>
          </el-dropdown-item> -->
          <el-divider class="divider" />
          <el-dropdown-item @click.native="logout">
            <span style="display:block;"><i class="el-icon-right" /> Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="Profile"
      width="42rem"
      :visible.sync="dialogProfile"
    >
      <div class="button-profle" style="margin-bottom: 10px;">
        <el-button v-if="!editPasswordStatus && !editStatus" type="primary" icon="el-icon-lock" @click="editPasswordStatus = true">Ubah Password</el-button>
        <el-button v-if="!editStatus && !editPasswordStatus" type="primary" icon="el-icon-edit" @click="editStatus = true">Edit Profile</el-button>
        <template v-if="editPasswordStatus || editStatus">
          <el-button type="info" @click="handleBatalEditProfile">Batal</el-button>
          <el-button type="success" @click="handleEditProfile">Simpan</el-button>
        </template>
      </div>
      <el-row :gutter="20">
        <el-col :span="24" :md="5">
          <div style="display: flex; justify-content: center;"><el-avatar shape="square" :size="90" :src="'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'" /></div>
          <div style="margin-top: 10px; text-align: center">
            <span style="display: block; font-size: x-small; color: gray;">Level</span>
            <span style="display: block;">{{ profile.text_level }}</span>
            <span style="display: block; margin: 10px 0 5px 0; font-size: x-small; color: gray;">Status</span>
            <el-tag :type="profile.id_status === '1' ? 'success' : 'danger'">{{ profile.status_text }}</el-tag>
          </div>
        </el-col>
        <el-col :span="24" :md="19">
          <span v-if="loadingData" class="el-icon-loading" style="display: flex; justify-content: center; font-size: 2rem;" />
          <el-form v-else ref="profileForm" :model="profile" :rules="rules" class="demo-ruleForm" :show-message="editStatus || editPasswordStatus">
            <el-row v-if="!editPasswordStatus" :gutter="10">
              <el-col :span="24" :md="12">
                <span class="label-item">Username</span>
                <el-form-item prop="username" style="margin-top: 5px;">
                  <el-input
                    v-model="profile.username"
                    :disabled="!editStatus"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="12">
                <span class="label-item">Nama</span>
                <el-form-item prop="nama" style="margin-top: 5px;">
                  <el-input
                    v-model="profile.nama"
                    :disabled="!editStatus"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="12">
                <span class="label-item">Alamat</span>
                <el-form-item prop="alamat" style="margin-top: 5px;">
                  <el-input
                    v-model="profile.alamat"
                    :type="editStatus ? 'textarea' : 'text'"
                    :disabled="!editStatus"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="12">
                <span class="label-item">No. Handphone</span>
                <el-form-item prop="hp" style="margin-top: 5px;">
                  <el-input
                    v-model="profile.hp"
                    :disabled="!editStatus"
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col v-if="editStatus" :span="24">
                <span class="label-item">Password</span>
                <el-form-item prop="password" style="margin-top: 5px;">
                  <el-input
                    v-model="profile['password']"
                    type="password"
                  />
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row v-else :gutter="10">
              <el-col :span="24">
                <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                  <el-form-item prop="password">
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="profile.password"
                      :type="passwordType"
                      style="width: 85%"
                      placeholder="Password"
                      name="password"
                      tabindex="2"
                      autocomplete="on"
                      @keyup.native="checkCapslock"
                      @blur="capsTooltip = false"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                </el-tooltip>
              </el-col>
              <el-col :span="24">
                <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                  <el-form-item prop="c_password">
                    <el-input
                      :key="passwordType"
                      ref="cPassword"
                      v-model="profile.c_password"
                      :type="passwordType"
                      style="width: 85%"
                      placeholder="Confirm Password"
                      name="c_password"
                      tabindex="2"
                      autocomplete="on"
                      @keyup.native="checkCapslock"
                      @blur="capsTooltip = false"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="editStatus" @click="handleCloseDialog">Keluar</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { edit as editProfile } from '@/api/profile'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Cookie from 'js-cookie'
// import { username } from '@/helpers/dataUser'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('password is required'))
      } else {
        if (this.profile.c_password !== '') {
          this.$refs.profileForm.validateField('c_password')
        }
        callback()
      }
    }

    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('confirm password is required'))
      } else if (value !== this.profile.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }

    return {
      user: {
        nama: Cookie.get('nama'),
        person: Cookie.get('person')
      },
      dialogProfile: false,
      profileReserve: {},
      // profileTest: {},
      profile: {
        username: '',
        password: '',
        c_password: '',
        nama: '',
        alamat: '',
        hp: ''
      },
      rules: {
        username: [
          { required: true, message: 'username is required', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        c_password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        nama: [
          { required: true, message: 'nama is required', trigger: 'blur' }
        ],
        alamat: [
          { required: true, message: 'alamat is required', trigger: 'blur' }
        ],
        hp: [
          { required: true, message: 'hp is required', trigger: 'blur' }
        ]
      },
      totalProfile: '',
      capsTooltip: false,
      editStatus: false,
      editPasswordStatus: false,
      isFirstData: true,
      loadingData: false,
      passwordType: 'password'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    notCounterPage() {
      return this.$route.path !== '/counter' && this.$route.path !== '/report-kehadiran'
    },
    counterPage() {
      return this.$route.path === '/counter' || this.$route.path === '/report-kehadiran'
    }

  },
  methods: {
    getProfile() {
      if (this.isFirstData) {
        this.loadingData = true
        this.$store.dispatch('profile/getDataProfile').then(() => {
          const profile = this.$store.getters.dataProfile[0]
          this.profile = profile
          this.profileReserve = {
            username: profile.username,
            password: '',
            c_password: '',
            nama: profile.nama,
            alamat: profile.alamat,
            hp: profile.hp
          }
          this.loadingData = false
          this.isFirstData = false
        })
      }
    },
    handleEditProfile() {
      this.$refs['profileForm'].validate(valid => {
        if (valid) {
          const temp = this.profile
          const formData = new FormData()
          formData.append('username', temp.username)
          formData.append('password', temp?.password || '')
          formData.append('nama', temp.nama)
          formData.append('alamat', temp.alamat)
          formData.append('hp', temp.hp)
          editProfile(formData).then(res => {
            this.editStatus = false
            this.editPasswordStatus = false
            this.profileReserve = {
              username: this.profile.username,
              password: '',
              c_password: '',
              nama: this.profile.nama,
              alamat: this.profile.alamat,
              hp: this.profile.hp
            }
            this.profile.password = ''
            if (res.success) {
              this.notifMessage('Berhasil', 'success', res.message)
              return
            }
            this.notifMessage('Gagal', 'error', res.message)
          })
        }
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
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    handleProfile() {
      this.dialogProfile = true
      this.getProfile()
    },
    handleCloseDialog() {
      this.dialogProfile = false
      this.editStatus = false
      this.profile.password = ''
    },
    handleBatalEditProfile() {
      this.editStatus = false
      this.editPasswordStatus = false
      this.profile.password = ''
      this.profile.c_password = ''
      this.profile.username = this.profileReserve.username
      this.profile.nama = this.profileReserve.nama
      this.profile.hp = this.profileReserve.hp
      this.profile.alamat = this.profileReserve.alamat
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 65px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  @media screen and (max-width: 660px) {
    .navbar-title{
      display: none;
    }
  }

  .breadcrumb-counter{
    font-style: 14px;
    margin-left: 30px;
    position: relative;
    top: 18px;
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.divider.el-divider--horizontal{
  margin: 10px 0 !important;
  padding: 0;
}

.label-item {
  color: rgb(141, 139, 139);
  font-size: 12px;
}

.value-item {
  padding: 0;
  margin: 5px 0 0 0;
}

.show-pwd {
  margin-left: 10px;
  font-size: 16px;
  color: gray;
  cursor: pointer;
  user-select: none;
}

.profile-name {
  display: inline-block;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 5px 12px 0px;
  color: grey;
  font-size: 14px;
}
</style>
