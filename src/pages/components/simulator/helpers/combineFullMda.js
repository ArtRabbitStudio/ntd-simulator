export const combineFullMda = (mdaHistory, mdaPrediction) => {
  const fullMda =
    mdaPrediction && mdaPrediction.time
      ? {
          time: [...mdaHistory.time, ...mdaPrediction.time],
          coverage: [...mdaHistory.coverage, ...mdaPrediction.coverage],
          adherence: [...mdaHistory.adherence, ...mdaPrediction.adherence],
          bednets: [...mdaHistory.bednets, ...mdaPrediction.bednets],
          regimen: [...mdaHistory.regimen, ...mdaPrediction.regimen],
          active: [...mdaHistory.active, ...mdaPrediction.active],
        }
      : mdaHistory
  return fullMda
}
