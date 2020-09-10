const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index')

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.jdrok.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,{
  useNewUrlParser:true,
  useUnifiedTopology: true
})
  .then(()=>{
    console.log("conexion exitosa a mongodb");
  })
  .catch((err)=>{
    console.log(err);
  })

  app.listen(3000);