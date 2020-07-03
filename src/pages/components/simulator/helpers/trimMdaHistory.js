export const trimMdaHistory = (mdaHistory) => {
  const yearsToLeaveOut = 14
  const mdaHistory2015 = {
    time: mdaHistory.time.filter(function (value, index, arr) {
      return index > yearsToLeaveOut
    }),
    coverage: mdaHistory.coverage.filter(function (value, index, arr) {
      return index > yearsToLeaveOut
    }),
    adherence: mdaHistory.adherence.filter(function (value, index, arr) {
      return index > yearsToLeaveOut
    }),
    bednets: mdaHistory.bednets.filter(function (value, index, arr) {
      return index > yearsToLeaveOut
    }),
    regimen: mdaHistory.regimen.filter(function (value, index, arr) {
      return index > yearsToLeaveOut
    }),
    active: mdaHistory.active.filter(function (value, index, arr) {
      return index > yearsToLeaveOut
    }),
  }
  return mdaHistory2015
}
