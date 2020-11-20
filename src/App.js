import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from './Components/Login'
import Dashboard from './Components/Dashboard';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/dashboard"></Redirect>
          </Route>
            <Route exact path="/" component={Login} />
            <Route path="/dashboard" component={Dashboard}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
