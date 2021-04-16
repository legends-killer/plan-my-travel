import React from 'react'
import { planDetailIF, planListIF } from './components/plans/types'
export interface PlanContextIF {
  columns: planListIF[]
  pubList: planDetailIF[]
}

export const PlanContext = React.createContext<PlanContextIF>(
  {} as PlanContextIF
)
export const MapContext = React.createContext<any>(null)
