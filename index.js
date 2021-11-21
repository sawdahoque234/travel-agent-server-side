const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId
app.use(cors());
app.use(express.json())
const port =process.env.PORT || 5000
app.get('/', (req, res) => {
    res.send('welcome in HoQTravel!!!!')
});
//hoqtravel
//zjp4v41iFEp5kslz
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eoyrd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelagent')
        const toursCollection = database.collection('tours')
        const bookingCollection=database.collection('books')

        
        app.get('/tours', async (req, res) => {
            const cursor=toursCollection.find({})
            const tours = await cursor.toArray();
            res.send(tours);
        })

        //get details tour
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const tour = await toursCollection.findOne(query)
            res.json(tour);
        })
        app.get('/books/:email', async (req, res) => {
            const email = await bookingCollection.findOne({email:req.body.email})
            res.json(email);
        })
        
         //post api
         app.post('/tours', async (req, res) => {
            const tour = req.body;
            console.log(tour)
            const result = await toursCollection.insertOne(tour);
            res.json(result)
        })
        
        //booking
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result=await bookingCollection.insertOne(book)
            console.log('books',book)
            res.json(result)
        })
        app.get('/books', async (req, res) => {
            const cursor=bookingCollection.find({})
            const books = await cursor.toArray();
            res.send(books);
        })
       

        // //deleteno
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id
            const query={_id:ObjectId(id)}
            const result=await bookingCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);





//listen
app.listen(port, () => {
    console.log('Server is running',port)
})