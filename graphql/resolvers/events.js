const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event=>{
        return transformEvent(event);
      });          
    } catch (err) {
      throw err;      
    }              
  },  
  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,        
        date: dateToString(args.eventInput.date),
        creator: '5f58823bc803f22fc0d0222b'        
      });
      let createdEvent;
      const result = await event.save();
      createdEvent = transformEvent(result);
        const creator = await User.findById('5f58823bc803f22fc0d0222b');
        if (!creator){
          throw new Error('user not found');
        }
        creator.createdEvents.push(event);
        await creator.save();
        return createdEvent; // or return event only ??? TODO      
    } catch (err) {
      console.log(err);
      throw err;      
    }
  }  
}