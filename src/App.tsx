import React from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/About'

function App() {
  return (
    <main>
      <div>
        <Link to="/">Home </Link>
        <Link to="/about">About Us </Link>
      </div>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/about" component={About} />
        <Route component={Home} />
      </Switch>
    </main>
  )
}

export default App
