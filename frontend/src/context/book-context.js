import React, {createContext, useState } from 'react';

export const BookContext = createContext();

const BookContextProvider = (props) => {

  const [bookings, setBookings] = useState([])

  return (
    <BookContext.Provider value={{ bookings, setBookings }}>
      {props.children}
    </BookContext.Provider>
  );
}
export default BookContextProvider;
