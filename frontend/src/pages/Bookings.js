import React, {useContext, useEffect, useState} from 'react'
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';
import Spiner from '../components/Spiner/Spiner';
import {AuthContext} from '../context/auth-context';
import {BookContext} from '../context/book-context';

function BookingsPage() {
  
  const {isLoading, setIsLoading} = useContext(AuthContext);
  const {bookings, setBookings} = useContext(BookContext);
  const {tokenData, setTokenData} = useContext(AuthContext);
  const [outputType,setOutputType] = useState('list')

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
              price
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
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables:{
        id: bookingId
      }
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

  const changeOutputTypeHandler = (outputType) => {
    if(outputType==='list'){
      setOutputType('list')
    }else{
      setOutputType('chart')
    }
  }

  let content = <Spiner/>;
  if(!isLoading){
    content = (
      <React.Fragment>        
        <BookingsControls changeOutputTypeHandler={changeOutputTypeHandler} activeOutputType={outputType}></BookingsControls>
        <div>
          {outputType === 'list' ?
            <BookingList bookings={bookings} onDelete={deleteBookingHandler} /> :
            <BookingsChart bookings={bookings} />
          }
        </div>
      </React.Fragment>
    )
  }
  
  return (
    <React.Fragment>
      { content }
    </React.Fragment>
  )
}

export default BookingsPage;