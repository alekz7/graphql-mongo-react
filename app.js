const express = require('express');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`

  type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    events: [Event!]!
  }

  type RootMutation{
    createEvent(eventInput: EventInput):Event
    createUser(userInput: UserInput):User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`),
  rootValue: {
    events: () => {
      // return events;
      return Event.find().then(events=>{
        return events.map(event=>{
          return {...event._doc}; // _id: event._doc._id.toString()
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
          createdEvent = {...result._doc}; // return {...result._doc, _id:result._doc._id.toString() };
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
  },
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.jdrok.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,{
  useNewUrlParser:true
})
  .then(()=>{
    console.log("conexion exitosa a mongodb");
  })
  .catch((err)=>{
    console.log(err);
  })

  app.listen(3000);