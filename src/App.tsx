import Nav from './components/navbar'
import { Route, Switch } from 'react-router-dom'
import Plans from './pages/Plans'
import About from './pages/About'
import './App.less'
import { useState, useReducer } from 'react'
import { planDetailIF, planListIF } from './components/plans/types'
import Map from './pages/Map'
import { PlanContext, PlanContextIF, reducer } from './utils'

const InitialPubList = [
  {
    id: 1,
    place: ['place'],
    actType: 'yyy',
  },
] as planDetailIF[]
const InitialColumns = [
  {
    id: 100,
    title: 'day1',
    details: [
      { id: 11, place: ['A'], actType: 'van' },
      { id: 2, place: ['B'] },
      { id: 3, place: ['A', 'B'] },
    ],
  },
  {
    id: 200,
    title: 'day2',
    details: [
      { id: 4, place: ['C'] },
      { id: 5, place: ['D'] },
    ],
  },
  {
    id: 300,
    title: 'day3',
    details: [],
  },
] as planListIF[]
const InitialPlanState = {
  pubList: InitialPubList,
  columns: InitialColumns,
} as PlanContextIF

function App() {
  const [state, dispatch] = useReducer(reducer, InitialPlanState)
  const planContextProvider = { state, dispatch }
  return (
    <main className="main">
      <div className="nav">
        <Nav />
      </div>
      <div className="content">
        <Switch>
          <Route path="/plans" exact>
            <PlanContext.Provider value={planContextProvider}>
              <Plans />
            </PlanContext.Provider>
          </Route>
          <Route path="/map" component={Map} />
          <Route path="/about" component={About} />
          <Route component={Plans} />
        </Switch>
      </div>
    </main>
  )
}

export default App
