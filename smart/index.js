// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const app = express();
// const port = process.env.port || 3000;



// const uri = "mongodb+srv://smartDBUser:MwQyoeRY4pOkCqhF@simple-crud-cluster.0hdbxiy.mongodb.net/?appName=Simple-crud-cluster";



// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// // middleware
// app.use(cors());
// app.use(express.json());


// async function run(){

//     try{
//         await client.connect();

//         const db = client.db("smart_user");
//         const productsCollection = db.collection("products");
//         const bidsCollection = db.collection("bids");
//         const usersCollection = db.collection("users");


//         app.get('/latest-products', async(req, res)=>{
//           const cursor = productsCollection.find().sort({created_at: -1}).limit(6);
//           const result = await cursor.toArray();
//           res.send(result);
//         })


//         app.get('/products', async(req, res)=>{
//           const email = req.query.email;
//           const query = {};
//           if (email){
//             query.email = email
//           }
//           const cursor = productsCollection.find(query);
//           const result = await cursor.toArray();
//           res.send(result);
//         })

//         app.get(`/products/:id`, async(req, res)=>{
//           const id = req.params.id;
//           const query = {_id: id}
//           const result = await productsCollection.findOne(query);
//           res.send(result);
//         })

//         app.post('/products', async(req, res)=>{
//           const products = req.body;
//           const result = await productsCollection.insertOne(products);
//           res.send(result)
//         })

//         app.patch('/products/:id', async(req, res)=>{
//           const id = req.params.id;
//           const updateContent = req.body
//           const query = { _id: new ObjectId(id) }
//           const update = {
//             $set: {
//               name: updateContent.name
//               // location: updateContent.location
//               // desktop: updateContent.desktop
//             }
//           }

//           const result = await productsCollection.updateOne(query, update);
//           res.send(result);
//         })

//         app.delete('/product/:id', async(req, res)=>{
//           const id = req.params.id;
//           const query = { _id: new ObjectId(id) }
//           const result = await productsCollection.deleteOne(query);
//           res.send(result)
//         })



//         app.get('/bids', async(req, res)=>{
//           const email = req.query.email;
//           const query = {};
//           if (email){
//             query.bidder_email = email
//           }
//           const cursor = bidsCollection.find(query);
//           const result = await cursor.toArray();
//           res.send(result)
//         })

//         app.post('/bids', async(req, res)=>{
//           const newBid = req.body;
//           const result = bidsCollection.insertOne(newBid);
//           res.send(result);
//         })

//         app.post('/users', async(req, res)=>{
//           const newUser = req.body;
//           const email = req.body.email
//           const query = {email: email}
//           const existingUser = usersCollection.find(query);

//           if (existingUser){
//             res.send({message: 'user already existing'})
//           }else{
            
//             const result = await usersCollection.insertOne(newUser);
//             res.send(result);
//           }
//         })

//         await client.db("admin").command({ping: 1});         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     }finally {
//     // Ensures that the client will close when you finish/error

//   }

// }
 
// run().catch(console.dir)

// app.listen(port, ()=>{
//     console.log()
// })