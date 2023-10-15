const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT || 3000;

/////}=MidleWare={/////
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@firstpractice.poejscf.mongodb.net/?retryWrites=true&w=majority`;

const uri = "mongodb+srv://bikeHut:rPz8OWSNYohSF6vU@firstpractice.poejscf.mongodb.net/?retryWrites=true&w=majority";

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
    const userCollection = client.db('bikeHutDB').collection('bike')


    // bike hut authentication related apis
    // bike hut authentication related apis

    app.get('/users', async(req, res) => {
      const cours = userCollection.find();
      const users = await cours.toArray();
      res.send(users);
    })

    app.post('/users', async(req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    /// update a data function
    app.patch('/users', async(req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = {
        $set: {
          lastLoginAt : user.lastLoginAt
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Bike Server Is Running!')
})

app.listen(port, () => {
  console.log(`Bike Server port is running: ${port}`)
})