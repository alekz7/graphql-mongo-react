import React, {useContext, useEffect} from 'react'
import BookingList from '../components/Bookings/BookingList/BookingList';
import Spiner from '../components/Spiner/Spiner';
import {AuthContext} from '../context/auth-context';
import {BookContext} from '../context/book-context';

function BookingsPage() {
  
  const {isLoading, setIsLoading} = useContext(AuthContext);
  const {bookings, setBookings} = useContext(BookContext);
  const {tokenData, setTokenData} = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    const requestBody = {
      query:`
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
          }
        }
      `
    };     
        
    fetch('http://localhost:8000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json',
        'Authorization' : 'Bearer ' + tokenData.token
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData=>{      
      const books = resData.data.bookings;
      setBookings(books);
      setIsLoading(false);
    }).catch(err=>{
      console.log(err);
      setIsLoading(false);
    })
  }, [])

  const deleteBookingHandler = bookingId => {
    setIsLoading(true);
    const requestBody = {
      query:`
        mutation {
          cancelBooking(bookingId:"${bookingId}") {
            _id
            title
          }
        }
      `
    };     
        
    fetch('http://localhost:8000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json',
        'Authorization' : 'Bearer ' + tokenData.token
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData=>{
      const newBooks = bookings.filter((booking)=>{
        return booking._id != bookingId;
      })      
      setBookings(newBooks);
      setIsLoading(false);
    }).catch(err=>{
      console.log(err);
      setIsLoading(false);
    })
  }
  
  return (
    <React.Fragment>
      {isLoading ? <Spiner/> :
      (
      <BookingList bookings={bookings} onDelete={deleteBookingHandler}/>
      )
      }
    </React.Fragment>
  )
}

export default BookingsPage
