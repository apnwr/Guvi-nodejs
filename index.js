const express = require("express");
const mongodb = require("mongodb");
const cors = require('cors');
const dotenv = require('dotenv');  // for confidential informations

dotenv.config(); 

const app = express();
const mongoCLient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const port = process.env.PORT || 3001;
let dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";


app.use(express.json());
app.use(cors());



app.get("/", async(req, res) => {
    try{
        let client = await mongodb.connect(dbUrl);
        let db = client.db("my_db");
        let result = await db.collection("users").find().toArray();
        res.status(200).json({ result });
        client.close();
    }
    catch (err){
        console.log(err);
        res.send(500);
    }
})

app.get("/get-user/:id", async (req, res) => {
    try {
        let client = await mongodb.connect(dbUrl);
        let db = client.db("my_db");
        let result = await db.collection("users").findOne({_id : objectId(req.params.id)});
        res.status(200).json({
            result
        });
        client.close();
    } catch (err) {
        console.log(err);
        res.send(500);
    }
})

app.post("/add-user", async (req, res) => {
    try {
        let client = await mongodb.connect(dbUrl);
        let db = client.db("my_db");
        let result = await db.collection("users").insertOne(req.body);
        res.status(200).json({
            message : "User Created"
        });
        client.close();
    } catch (err) {
        console.log(err);
        res.send(500);
    }
})

app.put("/update-user/:id", async (req, res) => {
    try {
        let client = await mongodb.connect(dbUrl);
        let db = client.db("my_db");
        let result = await db.collection("users").findOneAndUpdate({_id : objectId(req.params.id)}, {$set : req.body});
        res.status(200).json({
            message: "User Updated",
            
        });
        client.close();
    } catch (err) {
        console.log(err);
        res.send(500);
    }
})

app.delete("/delete-user/:id", async (req, res) => {
    try {
        let client = await mongodb.connect(dbUrl);
        let db = client.db("my_db");
        let result = await db.collection("users").deleteOne({ _id: objectId(req.params.id) });
        res.status(200).json({
            message: "User deleted"
        });
        client.close();
    }
    catch (err) {
        console.log(err);
        res.send(500);
    }
})


app.listen(port, () => {
    console.log(`The application is running successfully with port : ${port}`)
})

