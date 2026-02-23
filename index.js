const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simple-crud-cluster.0hdbxiy.mongodb.net/?appName=Simple-crud-cluster`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection


    const DB = client.db("ecotrack_user");
    const challengesCollection = DB.collection("challenges");
    const activeChallengesCollection = DB.collection("active-challenges");
    const tipsCollection = DB.collection("tips");
    const eventsCollection = DB.collection("events");

    // challenges

    app.post('/api/challenges', async(req, res)=>{
        const newChallenge = req.body;
        const result = await challengesCollection.insertOne(newChallenge)
        res.send(result)

    });

    app.get('/api/challenges', async(req, res)=>{
        const cursor = challengesCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    });

    // active challenges

    app.post('/api/active-challenges', async(req, res)=>{
        const newActiveChallenge = req.body;
        const result = await activeChallengesCollection.insertOne(newActiveChallenge)
        res.send(result)

    });

     app.get('/api/active-challenges', async(req, res)=>{
        const cursor = activeChallengesCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    });
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // tips section

    app.post('/api/tips', async(req, res)=>{
      const newTips = req.body;
      const result = await tipsCollection.insertOne(newTips);
      res.send(result)
    });

    app.get('/api/tips', async(req, res)=>{
      const cursor = tipsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // events section

    app.post('/api/events', async(req, res)=>{
      const newEvents = req.body;
      const result = await eventsCollection.insertOne(newEvents);
      res.send(result);
    })


} finally {
    // Ensures that the client will close when you finish/error
}
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

