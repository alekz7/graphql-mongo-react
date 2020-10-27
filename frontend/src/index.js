import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';
import EventContextProvider from './context/event-context';
import BookContextProvider from './context/book-context';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
    <EventContextProvider>
    <BookContextProvider>
      <App />
    </BookContextProvider>
    </EventContextProvider>      
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
