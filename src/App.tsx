import Nav from './components/navbar'
import { Route, Switch } from 'react-router-dom'
import Plans from './pages/Plans'
import About from './pages/About'
import './App.less'
import { useState } from 'react'
import { planDetailIF } from './components/plans/types'
import Map from './pages/Map'

const InitialPubList = [
  {
    id: 1,
    place: ['place'],
    actType: 'yyy',
  },
] as planDetailIF[]

function App() {
  const [pubList, setPubList] = useState(InitialPubList)
  return (
    <main className="main">
      <div className="nav">
        <Nav />
      </div>
      <div className="content">
        <Switch>
          <Route path="/plans" exact>
            <Plans pubList={pubList} updateList={setPubList} />
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
