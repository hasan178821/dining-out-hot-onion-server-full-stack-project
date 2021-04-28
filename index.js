const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require("cors");


const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h7tlf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allFoodsCollection = client.db(`${process.env.DB_NAME}`).collection("allFoods");
  const placedOrderCollection = client.db(`${process.env.DB_NAME}`).collection("OrderPlaced");

  app.post('/addFoods', (req, res) => {
    console.log(req.body);
    allFoodsCollection.insertOne(req.body)
    .then(foods => {
      res.send(foods.insertedCount > 0);
    })
  })

  app.get('/getFoods', (req, res) => {
    allFoodsCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post('/addOrder', (req, res) =>{
    console.log(req.body);
    placedOrderCollection.insertOne(req.body)
    .then(order => {
      res.send(order.insertedCount > 0)
      console.log(order)
    })
  })

  app.get('/getOrderedInfo', (req, res) => {
    placedOrderCollection.find()
    .toArray((err, orderData) => {
      res.send(orderData)
      console.log(orderData);
    })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen( process.env.PORT ||5000 )