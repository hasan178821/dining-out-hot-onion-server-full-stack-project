const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h7tlf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const breakfastCollection = client.db(`${process.env.DB_NAME}`).collection("breakfast");
  const placedOrderCollection = client.db(`${process.env.DB_NAME}`).collection("OrderPlaced");
  
  app.post('/addBreakfast', (req, res) => {
    console.log(req.body);
    const breakfastCard = (req.body);
    console.log('adding a breakfast', breakfastCard)
    breakfastCollection.insertOne(breakfastCard)
    .then( items => {
      res.send(items.insertedCount > 0)
    })
  })

  app.get('/getBreakfastInfo', (req, res) => {
    breakfastCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
      console.log(documents)
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

app.listen(5000)