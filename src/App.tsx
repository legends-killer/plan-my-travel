import Nav from './components/navbar'
import { Route, Switch } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/About'
import './App.less'

function App() {
  return (
    <main className="main">
      <div className="nav">
        <Nav />
      </div>
      <div className="content">
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
          <Route component={Home} />
        </Switch>
      </div>
    </main>
  )
}

export default App
