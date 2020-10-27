import React, {createContext, useState, useContext } from 'react';
import {AuthContext} from '../context/auth-context';

export const EventContext = createContext();

const EventContextProvider = (props) => {

  const {tokenData, setTokenData} = useContext(AuthContext);
  const {selectedEvent, setSelectedEvent} = useContext(AuthContext);
  const [creating, setCreating] = useState(false);

  const [event, setEvent] = useState({
    title:'',
    price:0,
    date:null,
    description:'',
  })

  const [events, setEvents] = useState([])

  const handleChange = (e)=>{
    setEvent({...event,
      [e.target.id] : e.target.value,
    })
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    
  }

  const startCreateEventHandler = () => {
    setCreating(true);
  }
  const modalCancelHandlerViewEventDetails = () => {
    setSelectedEvent(null)
  }
  const modalConfirmHandlerViewEventDetails = () => {
    //ignoring for now//
  }  
  const modalCancelHandler = () => {
    setCreating(false);
  }
  const modalConfirmHandler = () => {
    setCreating(false);
    if(
      event.title.trim().length === 0 ||
      event.price.trim().length === 0 ||
      event.date.trim().length === 0 ||
      event.description.trim().length === 0
      ) return;
    const newEvent = event;
    newEvent.price = +event.price; // casting to a number    
    const requestBody = {
      query:`
        mutation {
          createEvent(eventInput: {title: "${newEvent.title}", description:"${newEvent.description}", price:${newEvent.price}, date:"${newEvent.date}"} ){
            _id
            title
            description
            date
            price
          }
        }
      `
    };
      
    const token = tokenData.token;
    
    fetch('http://localhost:8000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + token
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData=>{      
      setEvents([...events,{
        _id:resData.data.createEvent._id,
        title:resData.data.createEvent.title,
        description:resData.data.createEvent.description,
        date:resData.data.createEvent.date,
        price:resData.data.createEvent.price,
        creator:{
          _id: tokenData.userId
        }
      }])      
    }).catch(err=>{
      console.log(err);
    })
  }
   
  return (
    <EventContext.Provider value={{ creating, startCreateEventHandler, modalCancelHandler, modalConfirmHandler,
                                    event, handleChange, handleSubmit,
                                    events, setEvents,
                                    modalCancelHandlerViewEventDetails,
                                    modalConfirmHandlerViewEventDetails
                                    }}>
      {props.children}
    </EventContext.Provider>
  );
}
export default EventContextProvider;
