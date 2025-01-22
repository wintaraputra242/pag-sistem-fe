const login = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  dialogForm: state => state.user.dialogForm,
  messageLogin: state => state.user.messageLogin,
  dataLogin: state => state.user.dataLogin
}

const dashboard = {
  dataDashboard: state => state.dashboard.data,
  totalDashboard: state => state.dashboard.total,
  dataDetailDashboard: state => state.dashboard.dataDetail,
  totalDetailDashboard: state => state.dashboard.totalDetail
}

const combo = {
  comboCabang: state => state.combo.combo_cabang,
  totalCabangCombo: state => state.combo.total_combo_cabang
}
const userPusat = {
  dataUserPusat: state => state.userPusat.data,
  dataUserForJadwal: state => state.userPusat.dataUserForJadwal,
  dataJadwal: state => state.userPusat.dataJadwal,
  totalDataUserForJadwal: state => state.userPusat.total_data_for_jadwal,
  totalUserPusat: state => state.userPusat.total_data
}
const userCabang = {
  dataUserCabang: state => state.userCabang.data,
  totalUserCabang: state => state.userCabang.total_data
}
const target = {
  dataTarget: state => state.target.data,
  totalTarget: state => state.target.total_data,
  dataDetailTarget: state => state.target.data_detail,
  totalDetailTarget: state => state.target.total_data_detail
}
const profile = {
  dataProfile: state => state.profile.data,
  totalProfile: state => state.profile.total_data
}
const capaian = {
  dataCapaian: state => state.capaian.data,
  totalCapaian: state => state.capaian.total_data
}
const report = {
  dataReport: state => state.report.data,
  totalReport: state => state.report.total_data,
  dataReportDetailCabang: state => state.report.data_detail.cabang,
  dataReportDetailSA: state => state.report.data_detail.sa,
  dataReportDetailSV: state => state.report.data_detail.sv
}

const tugas = {
  dataTugas: state => state.tugas.data,
  totalTugas: state => state.tugas.total_data
}

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  ...login,
  ...dashboard,
  ...combo,
  ...userPusat,
  ...userCabang,
  ...target,
  ...profile,
  ...capaian,
  ...report,
  ...tugas
}
export default getters
