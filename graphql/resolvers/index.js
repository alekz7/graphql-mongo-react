const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const events = eventIds => {
  return Event.find({_id:{$in: eventIds}}).then((events)=>{
    return events.map(event => {
      return {
        ...event._doc,
        _id:event.id,
        date: new Date(event._doc.date).toISOString(),
        creator:user.bind(this, event.creator)
      };
    })
  }).catch((err)=>{
    throw err;
  })
}

const user = userId => {
  return User.findById(userId).then((user)=>{
    return {...user._doc, _id: user.id,
    createdEvents: events.bind(this,user._doc.createdEvents)};
  }).catch((err)=>{
    throw err;
  })
}

module.exports = {
  events: () => {
    // return events;
    return Event.find()
    .then(events=>{
      return events.map(event=>{
        // return {...event._doc}; // _id: event._doc._id.toString()
        // return {...event._doc, creator:{ ...event._doc.creator._doc, _id: event._doc.creator.id }}; // _id: event._doc._id.toString() sobreescribiendo el id
        return {
          ...event._doc, 
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
      })
    }).catch((err)=>{
      throw err;
    })
  },
  createEvent: (args) => {    
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,        
      date: new Date(args.eventInput.date),
      creator: '5f58823bc803f22fc0d0222b'        
    });
    let createdEvent;
    return event
      .save()
      .then((result)=>{
        createdEvent = {
          ...result._doc,
          _id: result._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator:user.bind(this, result._doc.creator)}; // return {...result._doc, _id:result._doc._id.toString() };
        
        return User.findById('5f58823bc803f22fc0d0222b');
        console.log(result);          
      })
      .then(user=>{
        if (!user){
          throw new Error('user not found');
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((resul)=>{
        // return {...result._doc}; // return {...result._doc, _id:result._doc._id.toString() };
        return createdEvent;
      })
      .catch(err=>{
      console.log(error);
      throw err;
    });
    return event;
  },
  createUser: args =>{
    return User.findOne({
      email:args.userInput.email
    }).then((user)=>{
      if(user){
        throw new Error('user exists already');
      }
      return bcrypt
      .hash(args.userInput.password, 12)
      })      
      .then(hashedPassword=>{
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
          active: true,
        });
        return user.save();
      })
      .then(result=>{
        return {...result._doc,password:null, _id: result.id };
      })
      .catch((err)=>{
        throw err;
      })      
  }
}