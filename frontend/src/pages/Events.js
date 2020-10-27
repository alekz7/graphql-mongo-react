import React, {useContext, useEffect} from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import EventList from '../components/Events/EventList/EventList';
import Spiner from '../components/Spiner/Spiner';
import {EventContext} from '../context/event-context'
import {AuthContext} from '../context/auth-context';

import './Events.css';


function EventsPage() {
  const {creating, startCreateEventHandler} = useContext(EventContext);  
  const {event, handleChange, handleSubmit} = useContext(EventContext);
  const {events, setEvents} = useContext(EventContext)
  const {tokenData, setTokenData} = useContext(AuthContext);
  const {isLoading, setIsLoading} = useContext(AuthContext);
  const {selectedEvent, setSelectedEvent} = useContext(AuthContext);

  const showDetailHandler = (eventId) => {
    setSelectedEvent(events.find(e=>e._id === eventId));
  }

  useEffect(() => {
    setIsLoading(true);
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
      setIsLoading(false);
    }).catch(err=>{
      console.log(err);
      setIsLoading(false);
    })
  }, []) // nos falta cada que se agregue un evento

  return (
    <React.Fragment>
      {(creating || selectedEvent) && <Backdrop/>}
      {creating && <Modal title="Add Event" canCancel canConfirm confirmText="Confirm">
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
        {selectedEvent && 
          <Modal title={selectedEvent.title} canCancelViewEventDetails canConfirmViewEventDetails confirmText="Book">
          <h1>{selectedEvent.title}</h1>
          <h2> ${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
          <p>{selectedEvent.description}</p>
          </Modal>
        }
        { tokenData.token && (<div className="events-control">
        <p>Share your own events</p>
        <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
      </div>)}
      {isLoading ? <Spiner/> : <EventList events={events} authUserId={tokenData.userId} onViewDetail={showDetailHandler}/>}
    </React.Fragment>
  )
}

export default EventsPage
