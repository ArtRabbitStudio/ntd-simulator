function getAllIndexes(arr, val) {
  var indexes = [],
    i = -1
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i)
  }
  return indexes
}

export const removeInactiveMDArounds = (fullMDA) => {
  console.log('cleaning MDA')
  console.log(fullMDA)
  const indexesToBeRemoved = getAllIndexes(fullMDA.active, false)
  //   console.log(indexesToBeRemoved)

  // setting coverage to 0 
  /*const cleanMDA = {
    time: [...fullMDA.time],
    coverage:
      fullMDA.coverage.map(
        (item, index) => {
          if ( indexesToBeRemoved.indexOf(index) !== -1 ) {
          return 0
        }
        return item
        }),
    adherence: [...fullMDA.adherence],
    bednets: [...fullMDA.bednets],
    regimen: fullMDA.regimen.map(
      (item, index) => {
        if ( indexesToBeRemoved.indexOf(index) !== -1 ) {
        return 'xxx'
      }
      return item
      }),
    active: [...fullMDA.active],
  }*/

  // actually removing treatment rounds
  const cleanMDA = {
    time: 
      fullMDA.time.filter(
        (item, index) => indexesToBeRemoved.indexOf(index) === -1
      ),
    coverage: 
      fullMDA.coverage.filter(
        (item, index) => indexesToBeRemoved.indexOf(index) === -1
      ),
    adherence: 
      fullMDA.adherence.filter(
        (item, index) => indexesToBeRemoved.indexOf(index) === -1
      ),
    bednets: 
      fullMDA.bednets.filter(
        (item, index) => indexesToBeRemoved.indexOf(index) === -1
      ),
    regimen: 
      fullMDA.regimen.filter(
        (item, index) => indexesToBeRemoved.indexOf(index) === -1
      ),
    active: 
      fullMDA.active.filter(
        (item, index) => indexesToBeRemoved.indexOf(index) === -1
      ),
  }
  console.log(cleanMDA)
  return cleanMDA
}
