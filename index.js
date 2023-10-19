const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


// Middleware 
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3il8g6r.mongodb.net/?retryWrites=true&w=majority`;


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

        const productCollection = client.db("productDB").collection("product")
        const brandCollection = client.db("productDB").collection("brandName")
        const sliderCollection = client.db("productDB").collection("slider")

        // 6Types of brand get
        app.get('/brandname', async (req, res) => {
            const cursor = brandCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        // 3rd step
        app.get('/product/:brandName', async (req, res) => {
            const brandname = req.params.brandName
            const query = { brandName: brandname }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // 4th
        app.get('/slider', async (req, res) => {
            const cursor = sliderCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        // 2nd step
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })



        // 1st Step POST Method

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log('added this product', newProduct)
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
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
    res.send('car brand website server is running');
})

app.listen(port, () => {
    console.log(`car brand website server running on port : ${port}`)
})