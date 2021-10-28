import NavBar  from './components/layout/NavBar';
import  Landing  from './components/layout/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { BrowserRouter as Router , Route,Switch } from 'react-router-dom';
import './App.css';
import React , {Fragment} from 'react'
const App = () => (
  <Router>
    <Fragment>
    <NavBar/>
    <Route exact path ='/' component={Landing}/>
    <section className="container">
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/register' component={Register}/>
      </Switch>
    </section>
  </Fragment>
  </Router>
)

export default App;
