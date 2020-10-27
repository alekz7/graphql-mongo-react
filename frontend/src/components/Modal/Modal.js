import React, {useContext} from 'react'
import {EventContext} from '../../context/event-context'

import './Modal.css';

function Modal(props){
  const {modalCancelHandler, modalConfirmHandler} = useContext(EventContext);
  const {modalCancelHandlerViewEventDetails, modalConfirmHandlerViewEventDetails} = useContext(EventContext);
  return(
    <div className="modal">
      <header className="modal__header"><h1>{props.title}</h1></header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.canCancel &&<button className="btn" onClick={modalCancelHandler}>Cancel</button>}
        {props.canConfirm && <button className="btn" onClick={modalConfirmHandler}>{props.confirmText}</button>}
        {props.canCancelViewEventDetails &&<button className="btn" onClick={modalCancelHandlerViewEventDetails}>Cancel</button>}
        {props.canConfirmViewEventDetails && <button className="btn" onClick={modalConfirmHandlerViewEventDetails}>{props.confirmText}</button>}
      </section>
    </div>
  )
}

export default Modal
