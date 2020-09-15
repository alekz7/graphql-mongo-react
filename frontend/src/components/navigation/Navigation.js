import React, {useContext} from 'react'
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import AuthContext from '../../context/auth-context';

function Navigation() {  
  const {token, userId, login} = useContext(AuthContext);  
  return (
    <header className="navigation">
      <div className="navigation__logo">
        <h1>Easy event</h1>
      </div>
      <nav className="navigation__items">
        <ul>
          {!token && <li><NavLink to="/auth">Authenticate </NavLink></li>}
          <li><NavLink to="/events">Events</NavLink></li>
          {token && <li><NavLink to="/bookings">Booking </NavLink></li>}
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
