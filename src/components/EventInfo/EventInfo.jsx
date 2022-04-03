import React from 'react'

function EventInfo() {
  return (
    <form className="event-form">
        <label className="event-form__label">Event Name</label>
        <input className="event-form__input" name="event" />
        <label className="event-form__label">Description</label>
        <textarea className="event-form__text-area" name="description" />
        <label className="event-form__label">When</label>
        <input className="event-form__input" name="date" />
        <label className="event-form__label">Event Size</label>
        <input type="number" min="0" className="event-form__input" name="size" />
       
        <button className="event-form__button">Submit</button>
      </form>
  )
}

export default EventInfo