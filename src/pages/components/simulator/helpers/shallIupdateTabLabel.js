import { specificScenarios } from './specificScenarios'

export const shallIupdateTabLabel = (specificPrediction, currentLabel) => {
  const result =
    // if specificPredition applies
    specificPrediction &&
    specificPrediction.label &&
    // and the label is empty?
    (typeof currentLabel === 'undefined' ||
      // or hasn't been manually changed
      currentLabel.indexOf('Scenario ') > -1 ||
      // or it just has been set by previous specificPrediction
      specificScenarios.filter((item) => {
        return item.label === currentLabel
       } ).length >
        0)
  return result
}
