const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const events = async eventIds => {
  try{
    const events = await Event.find({_id:{$in: eventIds}})
    return events.map(event => {
        return {
          ...event._doc,
          _id:event.id,
          date: new Date(event._doc.date).toISOString(),
          creator:user.bind(this, event.creator)
        };
    });
  }catch(err){
    throw err;
  }  
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return {...user._doc, 
      _id: user.id,
      createdEvents: events.bind(this,user._doc.createdEvents)
    };
  } catch (err) {
    throw err;    
  }  
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event=>{
        return {
          ...event._doc, 
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
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
        date: new Date(args.eventInput.date),
        creator: '5f58823bc803f22fc0d0222b'        
      });
      let createdEvent;
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator:user.bind(this, result._doc.creator)}; // return {...result._doc, _id:result._doc._id.toString() };
        const user = await User.findById('5f58823bc803f22fc0d0222b');
        if (!user){
          throw new Error('user not found');
        }
        user.createdEvents.push(event);
        await user.save();
        return createdEvent; // or return event only ??? TODO      
    } catch (err) {
      console.log(error);
      throw err;      
    }
  },
  createUser: async args =>{
    try {
      const existingUser = await User.findOne({ email:args.userInput.email });
      if(existingUser){
        throw new Error('user exists already');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        active: true,
      });
      const result = await user.save();
      return {...result._doc,password:null, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
}