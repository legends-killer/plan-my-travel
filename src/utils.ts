import React from 'react'
import {
  planDetailIF,
  planListIF,
  planContextIF,
} from './components/plans/types'

export const PlanContext = React.createContext<{
  state: planContextIF
  dispatch: (action: any) => void
}>({
  state: { columns: [], pubList: [], nextColumnId: 10003, nextPlanId: 8 },
  dispatch: () => {},
})

export const reducer = (
  state: planContextIF,
  action: { type: string; newVal?: any }
) => {
  switch (action.type) {
    case 'setColumns':
      return Object.assign({}, state, {
        columns: action.newVal as planListIF[],
      })
    case 'setPubList':
      return Object.assign({}, state, {
        pubList: action.newVal as planDetailIF[],
      })
    case 'setNextColumnId':
      return Object.assign({}, state, {
        nextColumnId: state.nextColumnId + 1,
      })
    case 'setNextPlanId':
      return Object.assign({}, state, {
        nextPlanId: state.nextPlanId + 1,
      })
    default:
      return state
  }
}

export const MapContext = React.createContext<any>(null)
