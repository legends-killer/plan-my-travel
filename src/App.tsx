import Nav from './components/navbar'
import { Route, Switch } from 'react-router-dom'
import Plans from './pages/Plans'
import About from './pages/About'
import './App.less'
import { useState, useReducer } from 'react'
import {
  planDetailIF,
  planListIF,
  planContextIF,
} from './components/plans/types'
import Map from './pages/Map'
import { PlanContext, reducer } from './utils'

const InitialPubList = [
  {
    id: 1,
    place: ['place'],
    actType: 'yyy',
  },
  {
    id: 2,
    place: ['pub2'],
    actType: 'aaa',
  },
] as planDetailIF[]
const InitialColumns = [
  {
    id: 10000,
    title: 'day1',
    details: [
      { id: 3, place: ['A'], actType: 'van' },
      { id: 4, place: ['B'] },
      { id: 5, place: ['A', 'B'] },
    ],
  },
  {
    id: 10001,
    title: 'day2',
    details: [
      { id: 6, place: ['C'] },
      { id: 7, place: ['D'] },
    ],
  },
  {
    id: 10002,
    title: 'day3',
    details: [],
  },
] as planListIF[]
const InitialPlanState = {
  pubList: InitialPubList,
  columns: InitialColumns,
  nextColumnId: 10003,
  nextPlanId: 8,
} as planContextIF

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
