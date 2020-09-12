import React from 'react'
import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <header className="navigation">
      <div className="navigation__logo">
        <h1>Easy event</h1>
      </div>
      <nav className="navigation__items">
        <ul>
          <li><NavLink to="/auth">Authenticate</NavLink></li>
          <li><NavLink to="/events">Events</NavLink></li>
          <li><NavLink to="/bookings">Booking</NavLink></li>          
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
