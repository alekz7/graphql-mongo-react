import React, {useContext, useEffect} from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import {EventContext} from '../context/event-context'
import {AuthContext} from '../context/auth-context';

import './Events.css';

function EventsPage() {
  const {creating, startCreateEventHandler} = useContext(EventContext);  
  const {event, handleChange, handleSubmit} = useContext(EventContext);
  const {events, setEvents} = useContext(EventContext)
  const {tokenData, setTokenData} = useContext(AuthContext);
  useEffect(() => {
    const requestBody = {
      query:`
        query {
          events {
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
          }
        }
      `
    };     
        
    fetch('http://localhost:8000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json'
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData=>{
      const events = resData.data.events;
      setEvents(events);
    }).catch(err=>{
      console.log(err);
    })
  }, []) // nos falta cada que se agregue un evento

  let eventList = events.map(event=>{
    return (<li key={event._id} className="events__list-item">{event.title}</li>);
  })

  return (
    <React.Fragment>
      {creating && <Backdrop/>}
      {creating && <Modal title="Add Event" canCancel canConfirm>
        <form>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input onChange={handleChange} type="text" id="title"></input>
          </div>
          <div className="form-control">
            <label htmlFor="price">Price</label>
            <input onChange={handleChange} type="number" id="price"></input>
          </div>          
          <div className="form-control">
            <label htmlFor="date">Date</label>
            <input onChange={handleChange} type="datetime-local" id="date"></input>
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea onChange={handleChange} id="description" rows="4"></textarea>            
          </div>
        </form>
        </Modal>}
      { tokenData.token && (<div className="events-control">
        <p>Share your own events</p>
        <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
      </div>)}
      <ul className="events__list">
        {eventList}
      </ul>
    </React.Fragment>
  )
}

export default EventsPage
