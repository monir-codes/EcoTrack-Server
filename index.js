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
    const userChallengesCollection = db.collection('users_challenges');    
    app.get('/', (req, res) => {
      res.send('Server is running successfully')
    });


   app.get('/api/challenges', async (req, res) => {
    const cursor = challengesCollection.find({}).sort({ startDate: -1 });
    const result = await cursor.toArray();
    res.send(result);
  });

   app.get(`/api/challenges/:id`, async(req, res)=>{
    const id = req.params.id;
    const query = {_id: id};
    const result = await challengesCollection.findOne(query);
    if(!result){
      return res.status(404).send({message: 'Challenge not found'})
    }
    res.send(result);
   });


   app.post('/api/challenges', async (req, res) => {
    const challenge = req.body;

    const query = {_id: challenge._id};
    const existingChallenge = await challengesCollection.findOne(query);

    if (existingChallenge) {
      return res.status(400).send({ message: 'Challenge with this ID already exists' });
    }

    const result = await challengesCollection.insertOne(challenge);
    res.send(result);
   });

const { ObjectId } = require('mongodb');

app.post('/api/challenges/join/:id', async (req, res) => {
    try {
        const challengeId = req.params.id;
        const { userId, userEmail } = req.body; // user identification

        // 1. ObjectId-te convert kora
        const query = { _id: new ObjectId(challengeId) };
        const challenge = await challengesCollection.findOne(query);

        if (!challenge) {
            return res.status(404).send({ message: 'Challenge not found' });
        }

        // 2. Check if already joined (UserChallenges collection theke)
        const alreadyJoined = await userChallengesCollection.findOne({
            userId: userId,
            challengeId: new ObjectId(challengeId)
        });

        if (alreadyJoined) {
            return res.status(400).send({ message: 'User already joined this challenge' });
        }

        // 3. Insert into UserChallenges (Tracking data)
        const newUserChallenge = {
            userId,
            challengeId: new ObjectId(challengeId),
            status: "Ongoing",
            progress: 0,
            joinDate: new Date()
        };
        await userChallengesCollection.insertOne(newUserChallenge);

        // 4. Update main Challenge participants count (Atomic Update)
        await challengesCollection.updateOne(query, {
            $addToSet: { participants: userId } 
        });

        res.send({ success: true, message: 'Joined successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
  

   app.patch('/api/challenges/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const query = {_id: id};
    const result = await challengesCollection.updateOne(query, { $set: updatedData });
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Challenge not found' });
    }
    res.send({ message: 'Challenge updated successfully' });
   });


   app.delete('/api/challenges/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: id};
    const result = await challengesCollection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Challenge not found' });
    } else {
      return res.send({ message: 'Challenge deleted successfully' });
    }
   });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

app.listen(port, () => {
  // console.log(`EcoTrack server is running on port ${port}`);
});
run().catch(console.dir);
