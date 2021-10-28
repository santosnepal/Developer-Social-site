import { NavBar } from './components/layout/NavBar';
import { Landing } from './components/layout/Landing';
import './App.css';
import React , {Fragment} from 'react'
const App = () => (
  <Fragment>
    <NavBar/>
    <Landing/>
  </Fragment>
)

export default App;
