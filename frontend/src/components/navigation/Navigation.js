import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import {AuthContext} from '../../context/auth-context';

function Navigation() {  
  const {tokenData, setTokenData} = useContext(AuthContext);  
  const logout = ()=>{console.log("logout");}
  return (
    <header className="navigation">
      <div className="navigation__logo">
        <h1>Easy event</h1>
      </div>
      <nav className="navigation__items">
        <ul>
          {!tokenData.token && <li><NavLink to="/auth">Authenticate </NavLink></li>}
          <li><NavLink to="/events">Events</NavLink></li>
          {tokenData.token &&
            <React.Fragment>
              <li><NavLink to="/bookings">Booking </NavLink></li>
              <li><button onClick={logout}>Logout</button></li>
            </React.Fragment>}
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
