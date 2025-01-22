/**
 * Calculate the no. of days between two dates,
 * divide the time difference of both dates by no. of milliseconds in a day (1000 * 60 * 60 * 24)
 *
 * @param {String} date_awal tanggal awal
 * @param {String} date_akhir tanggal akhir
 * @returns {Number} number of difference between tanggal akhir and tanggal awal
 */
export default function getDateDiff(date_awal, date_akhir) {
  date_awal = new Date(date_awal)
  date_akhir = new Date(date_akhir)

  // To calculate the time difference of two dates
  const Difference_In_Time = date_akhir.getTime() - date_awal.getTime()

  // To calculate the no. of days between two dates
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)

  return Difference_In_Days
}
