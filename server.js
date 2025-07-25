import express from 'express'
const app = express()
import 'dotenv/config'
import cors from 'cors';
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['POST', 'GET'],  
    allowedHeaders: 'Content-Type'
}
const PORT = 5000
import { MongoClient } from 'mongodb';
import uploadImage from './uploadImage.js'
const uri = process.env.MONGO_URL
const client = new MongoClient(uri);
const database = client.db('Fringe')
const entries = database.collection('clients')

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

async function getAllClients() {
    try {
        const items = await entries.find({}).toArray() 
        return items
    } catch {
        console.error("An error occured in the getAllClients function", error)
    }
}

async function getClientById(clientDetails) {
    try {
        const findResult = await entries.findOne({
            firstname: clientDetails.first, 
            lastname: clientDetails.last
        })
        return findResult
    } catch (error) {
        console.error("An error occured in the getClientById function", error)
    }
}

app.get('/',  async (req, res) => {
    const result = await getAllClients()
    res.send(result)
})


app.post('/client',  async (req, res) => {
    const result = await getClientById(req.body)
    res.send(result)
})


app.post('/upload', async (req, res) => {

    await uploadImage(req.body.image)
        .then((url) => {
            res.send(url)
        })
        .catch((err) => console.log("There was an error", err))
})

app.post('/add', async (req, res) => {

    try {
        const result = await entries.insertOne(req.body);
        res.send(result)

    } catch (error) {
        console.error("An error occured in the addClient function", error)
    }
})

app.listen(PORT, () => console.log(`Your cool server is listening on port ${PORT}`))