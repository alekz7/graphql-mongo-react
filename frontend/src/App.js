import React, {useState, useContext} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import Navigation from './components/navigation/Navigation';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import {AuthContext} from './context/auth-context';

function App() {
  // const [token, setToken]   = useState();
  // const [userId, setUserId] = useState();
  // const login = (token, userId, tokenExpiration) => {
  //   setToken(token);
  //   setUserId(userId);
  // }
  // const logout = () => {
  //   setToken(null);
  //   setUserId(null);
  // }
  const {tokenData, setTokenData} = useContext(AuthContext);  
  
  return (
    <BrowserRouter>
      <React.Fragment>                  
          <Navigation />
          <main className="main-content">
            <Switch>              
              {tokenData.token && <Redirect from ="/" to="/events" exact />}
              {tokenData.token && <Redirect from ="/auth" to="/events" exact />}
              {!tokenData.token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {tokenData.token && <Route path="/bookings" component={BookingsPage} />}
              {!tokenData.token && <Redirect from ="/" to="/auth" exact />}
            </Switch>
          </main>          
      </React.Fragment>
    </BrowserRouter>    
  );
}

export default App;
