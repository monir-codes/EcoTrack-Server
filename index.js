import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config();
const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 3000

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

// middleware
app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-crud-cluster.0hdbxiy.mongodb.net/?appName=Simple-crud-cluster`;

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
    const db = client.db('ecotrack_db');
    const challengesCollection = db.collection('challenges');
    
    app.get('/', (req, res) => {
      res.send('Server is running successfully')
    });


  app.get('/api/challenges', async (req, res) => {
    const cursor = challengesCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  });

   app.post('/api/challenges', async (req, res) => {
    const challenge = req.body;
    const result = await challengesCollection.insertOne(challenge);
    res.send(result);
   });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

app.listen(port, () => {
  console.log(`EcoTrack server is running on port ${port}`);
});
run().catch(console.dir);
