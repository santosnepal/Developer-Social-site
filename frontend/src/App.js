import NavBar  from './components/layout/NavBar';
import  Landing  from './components/layout/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Alert from './components/layout/Alert';
import { BrowserRouter as Router , Route,Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import React , {Fragment} from 'react'
const App = () => (
  <Provider store={store}>
  <Router>
    <Fragment>
    <NavBar/>
    <Route exact path ='/' component={Landing}/>
    <section className="container">
      <Alert/>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/register' component={Register}/>
      </Switch>
    </section>
  </Fragment>
  </Router>
  </Provider>
)

export default App;
